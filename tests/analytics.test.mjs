import test from 'node:test';
import assert from 'node:assert/strict';

const model = { slug: 'galaxy-z-fold8', name: 'Galaxy Z Fold8', series: 'Galaxy Z Fold', formFactor: 'foldable-book' };

test('analytics gates collection and tracks interest independently from default exposure', async () => {
  const analytics = await import('../app/lib/analytics.ts');
  // Prerendering must neither access the DOM nor initialize tracking.
  analytics.initializeAnalytics('G-TEST123', true);
  analytics.trackPageView('/', model);
  const scripts = [];
  globalThis.window = { location: { hostname: 'localhost', origin: 'https://windowinsets.info' } };
  globalThis.document = {
    title: 'WindowInsets', referrer: 'https://example.com/',
    createElement: () => ({}), head: { appendChild: script => scripts.push(script) },
  };
  try {
    analytics.initializeAnalytics('G-TEST123', true);
    window.location.hostname = 'preview.vercel.app';
    analytics.initializeAnalytics('G-TEST123', true);
    window.location.hostname = 'windowinsets.info';
    analytics.initializeAnalytics('G-TEST123', false);
    analytics.initializeAnalytics(undefined, true);
    analytics.initializeAnalytics('not-a-measurement-id', true);
    analytics.trackDeviceSelection(model);
    analytics.trackJsonExport(model);
    analytics.trackUnitChange(model, 'px');
    analytics.trackFoldPoseChange(model, 90, 'hinge_slider');
    analytics.trackSupportClick();
    assert.equal(scripts.length, 0);
    assert.equal(window.dataLayer, undefined);

    analytics.initializeAnalytics('G-TEST123', true);
    analytics.initializeAnalytics('G-TEST123', true);
    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].async, true);
    const commands = () => window.dataLayer.map(args => Array.from(args));
    assert.equal(commands().find(c => c[0] === 'config')[2].send_page_view, false);

    // No Google script is executed here: blocked/slow scripts must not block navigation.
    analytics.trackPageView('/', model);
    analytics.trackPageView('/', model); // React rerenders / effect replay
    analytics.trackDeviceSelection(model);
    analytics.trackDeviceSelection(model); // repeated clicks are actual interest
    analytics.trackJsonExport(model);
    analytics.trackUnitChange(model, 'px');
    analytics.trackFoldPoseChange(model, 90, 'hinge_slider');
    analytics.trackFoldPoseChange(model, 180, 'pose_menu');
    analytics.trackSupportClick();
    analytics.trackPageView('/galaxy-z-fold8', model);
    analytics.trackPageView('/methodology');
    analytics.trackPageView('/galaxy-z-fold8', model); // browser Back
    const events = commands().filter(c => c[0] === 'event');
    assert.equal(events.filter(c => c[1] === 'page_view').length, 4);
    const views = events.filter(c => c[1] === 'device_view');
    assert.equal(views.length, 3);
    assert.equal(views[0][2].view_source, 'home_default');
    assert.equal(views[1][2].view_source, 'device_page');
    assert.equal(views[2][2].page_referrer, 'https://windowinsets.info/methodology');
    const selections = events.filter(c => c[1] === 'device_select');
    assert.equal(selections.length, 2);
    assert.equal(selections[0][2].device_slug, model.slug);
    assert.equal(selections[0][2].form_factor, 'foldable-book');
    assert.equal(selections[0][2].selection_source, 'device_list');
    const exports = events.filter(c => c[1] === 'json_export');
    assert.equal(exports.length, 1);
    assert.equal(exports[0][2].device_slug, model.slug);
    const unitChanges = events.filter(c => c[1] === 'unit_change');
    assert.equal(unitChanges.length, 1);
    assert.equal(unitChanges[0][2].dimension_unit, 'px');
    const poseChanges = events.filter(c => c[1] === 'fold_pose_change');
    assert.equal(poseChanges.length, 2);
    assert.equal(poseChanges[0][2].fold_pose, 'partially_open');
    assert.equal(poseChanges[0][2].control_source, 'hinge_slider');
    assert.equal(poseChanges[1][2].fold_pose, 'open');
    assert.equal(poseChanges[1][2].control_source, 'pose_menu');
    const supportClicks = events.filter(c => c[1] === 'support_click');
    assert.equal(supportClicks.length, 1);
    assert.deepEqual(supportClicks[0][2], { support_platform: 'ko_fi', link_location: 'sidebar_footer' });
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});
