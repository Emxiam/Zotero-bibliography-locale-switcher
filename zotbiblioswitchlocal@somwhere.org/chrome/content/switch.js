/*
	***** BEGIN LICENSE BLOCK *****
Version: MPL 1.1/GPL 2.0/LGPL 2.1

The contents of this file are subject to the Mozilla Public License Version
1.1 (the "License"); you may not use this file except in compliance with
the License. You may obtain a copy of the License at
http://www.mozilla.org/MPL/

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
for the specific language governing rights and limitations under the
License.

Based from Benjamin Smedberg's Quick Locale Switcher http://benjamin.smedbergs.us/switch-locales/The Initial Developer of the Original Code is Martijn Kooij a.k.a. Captain Caveman.

Alternatively, the contents of this file may be used under the terms of
either the GNU General Public License Version 2 or later (the "GPL"), or
the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
in which case the provisions of the GPL or the LGPL are applicable instead
of those above. If you wish to allow use of your version of this file only
under the terms of either the GPL or the LGPL, and not to allow others to
use your version of this file under the terms of the MPL, indicate your
decision by deleting the provisions above and replace them with the notice
and other provisions required by the GPL or the LGPL. If you do not delete
the provisions above, a recipient may use your version of this file under
the terms of any one of the MPL, the GPL or the LGPL.

***** END LICENSE BLOCK ***** */


// change zotero export locale
function zotLocales_switch(locale) {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);

  var curLocale = "";
  try {
    curLocale = prefs.getCharPref("extensions.zotero.export.bibliographyLocale");
  }
  catch (e) { }

  if (locale != curLocale) {
    prefs.setCharPref("extensions.zotero.export.bibliographyLocale", locale);


  //todo check if alert is diplay to restart browser/ zoterostandalone before use the new locale
    var sbs = Components.classes["@mozilla.org/intl/stringbundle;1"].
      getService(Components.interfaces.nsIStringBundleService);
    var brand_sb = sbs.createBundle("chrome://branding/locale/brand.properties");
    var ext_sb = sbs.createBundle("chrome://mozapps/locale/extensions/extensions.properties");
    var shortName = brand_sb.GetStringFromName("brandShortName");
    try {
	var promptStr = ext_sb.
	    formatStringFromName("restartBeforeEnableMessage",
				 [ locale, shortName ], 2);
    }
    catch (e) {
	promptStr = ext_sb.formatStringFromName("dssSwitchAfterRestart",
						[shortName], 1);
    }

    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
      getService(Components.interfaces.nsIPromptService);
    prompts.alert(window, document.getElementById("zotLocales_menu").label,
                  promptStr);
  }
}


function OpenSettings() {
	
        window.openDialog("chrome://locale-switch/content/settings.xul", "zls-settings", "chrome,toolbar,resizable,centerscreen");
	
}


//create custom menu
function zotLocales_load(menu) {
 
 var prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);

 var zoteroLocale = "";
  try {
    zoteroLocale = prefs.getCharPref("extensions.zotero.export.bibliographyLocale");
  	}
  catch (e) { }
  
 //get selected locales 
  var visibleLocale = prefs.getCharPref("extensions.zls.visiblemenuitems");
  var showLocale = visibleLocale.split("#");
        
        var iIndex, iLen;

        iLen = showLocale.length;

        for (iIndex = 0; iIndex < iLen; iIndex++) {
        	
        	var item = document.getElementById(showLocale[iIndex]);
        	//show selected locales
    		item.setAttribute("hidden", false);
    		
    		if (zoteroLocale == showLocale[iIndex]) {
    			item.setAttribute("checked", "true");
    		}
            
        }
	var itemDefault =document.getElementById("defaultZLS");
	if (zoteroLocale == "") {
    			itemDefault.setAttribute("checked", "true");
    		}

}



