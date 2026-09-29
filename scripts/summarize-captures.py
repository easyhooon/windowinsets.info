#!/usr/bin/env python3
"""Print one line of insets per InsetsProbe JSON file, to compare a new set with accepted captures."""
import json,sys
def summ(p):
    d=json.load(open(p)); i=d['insets']
    g=lambda k: tuple(i[k]['px'].values()) if k in i else None
    return dict(model=d['device'].get('model'), build=d['device'].get('buildId'), rot=d['display'].get('rotation'),
      size=(d['display'].get('widthPx'), d['display'].get('heightPx')), dpi=d['display'].get('densityDpi'), font=d['display'].get('fontScale'),
      sys=g('systemBars'), nav=g('navigationBars'), tap=g('tappableElement'), sg=g('systemGestures'), cut=g('displayCutout'),
      mode=(d['navigation']['mode'],d['navigation']['settingsSecureNavigationMode'],d['navigation']['configNavBarInteractionMode']),
      ts=d['capturedAt'])
for p in sys.argv[1:]:
    print(p.split('measurements/')[-1][-70:]); print('   ',summ(p))
