'use strict';

const ADMOB_TEST = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712'
};

function isNativeApp() {
  return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

let adsReady = false;

async function adsInit() {
  if (!isNativeApp() || adsReady) return;
  try {
    const { AdMob } = Capacitor.Plugins;
    await AdMob.initialize({ initializeForTesting: true });
    adsReady = true;
  } catch (e) { console.warn('[AdMob] init failed', e); }
}

async function showAdsBanner() {
  if (!isNativeApp()) return;
  try {
    await adsInit();
    const { AdMob } = Capacitor.Plugins;

    AdMob.addListener('bannerAdSizeChanged', (info) => {
      if (info && info.height) {
        document.body.style.paddingTop = info.height + 'px';
      }
    });

    await AdMob.showBanner({
      adId: ADMOB_TEST.banner,
      adSize: 'BANNER',
      position: 'TOP_CENTER',
      isTesting: true
    });
  } catch (e) { console.warn('[AdMob] banner failed', e); }
}

async function preloadInterstitial() {
  if (!isNativeApp()) return;
  try {
    const { AdMob } = Capacitor.Plugins;
    await AdMob.prepareInterstitial({ adId: ADMOB_TEST.interstitial, isTesting: true });
  } catch (e) { console.warn('[AdMob] interstitial preload failed', e); }
}

async function showPreloadedInterstitial() {
  if (!isNativeApp()) return;
  try {
    const { AdMob } = Capacitor.Plugins;
    await AdMob.showInterstitial();
  } catch (e) {
    console.warn('[AdMob] interstitial show failed, will retry preload', e);
  } finally {
    preloadInterstitial();
  }
}

function startInterstitialTimer() {
  if (!isNativeApp()) return;
  setInterval(() => {
    showPreloadedInterstitial();
  }, 60000);
}

document.addEventListener('DOMContentLoaded', () => {
  if (isNativeApp()) {
    adsInit()
      .then(showAdsBanner)
      .then(preloadInterstitial)
      .then(startInterstitialTimer)
      .catch(() => {});
  }
});
