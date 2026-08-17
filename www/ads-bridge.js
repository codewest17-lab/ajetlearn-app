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
    await AdMob.showBanner({
      adId: ADMOB_TEST.banner,
      adSize: 'ADAPTIVE_BANNER',
      position: 'BOTTOM_CENTER',
      isTesting: true
    });
  } catch (e) { console.warn('[AdMob] banner failed', e); }
}

async function showAdsInterstitial() {
  if (!isNativeApp()) return;
  try {
    await adsInit();
    const { AdMob } = Capacitor.Plugins;
    await AdMob.prepareInterstitial({ adId: ADMOB_TEST.interstitial, isTesting: true });
    await AdMob.showInterstitial();
  } catch (e) { console.warn('[AdMob] interstitial failed', e); }
}

document.addEventListener('DOMContentLoaded', () => {
  if (isNativeApp()) {
    adsInit().then(showAdsBanner).catch(() => {});
  }
});
