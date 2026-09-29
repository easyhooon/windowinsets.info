#!/bin/zsh
# rtl-tap.sh SERIAL "text regex" -> taps the first node whose text matches
s=$1; pat=$2
adb -s $s shell uiautomator dump /sdcard/ui.xml >/dev/null
adb -s $s shell cat /sdcard/ui.xml | python3 -c "
import sys,re
x=sys.stdin.read()
for m in re.finditer(r'<node [^>]*?text=\"([^\"]*)\"[^>]*?bounds=\"\[(\d+),(\d+)\]\[(\d+),(\d+)\]\"',x):
  if re.search(sys.argv[1],m.group(1)):
    a,b,c,d=map(int,m.groups()[1:]); print((a+c)//2,(b+d)//2,m.group(1)); break
" "$pat" | read x y t && { echo "tap $x $y $t"; adb -s $s shell input tap $x $y; } || echo "not found: $pat"
