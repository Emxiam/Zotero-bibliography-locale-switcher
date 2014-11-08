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

const ZLS_ALL_LOCALES = "af-ZA#am-ET#ar-AE#ar-BH#ar-DZ#ar-EG#ar-IQ#ar-JO#ar-KW#ar-LB#ar-LY#ar-MA#ar-OM#ar-QA#ar-SA#ar-SY#ar-TN#ar-YE#arn-CL#as-IN#ast-ES#az-AZ-Cyrl#az-AZ-Latn#ba-RU#be-BY#ber-DZ#bg-BG#bn-BD#bn-IN#bo-BT#bo-CN#br-FR#bs-BA-Cyrl#bs-BA-Latn#ca-AD#ca-ES#ca-FR#ca-valencia#co-FR#cs-CZ#cy-GB#da-DK#de-AT#de-CH#de-DE#de-LI#de-LU#div-MV#el-GR#en-AU#en-BZ#en-CA#en-CB#en-GB#en-IE#en-IN#en-JA#en-MY#en-NZ#en-PH#en-SG#en-TT#en-US#en-ZA#en-ZW#eo-EO#es-AR#es-BO#es-CL#es-CO#es-CU#es-CR#es-DO#es-EC#es-ES#es-ES-ts#es-GT#es-HN#es-MX#es-NI#es-PA#es-PE#es-PR#es-PY#es-SV#es-UY#es-US#es-VE#et-EE#eu-ES#fa-IR#fi-FI#fil-PH#fo-FO#fr-BE#fr-CA#fr-CH#fr-FR#fr-LU#fr-MC#fur-IT#fy-NL#ga-IE#gbz-AF#gd-GB#gl-ES#gsw-FR#gu-IN#ha-NG-Latn#he-IL#hi-IN#hr-BA#hr-HR#hu-HU#hy-AM#id-ID#ii-CN#is-IS#it-CH#it-IT#iu-CA-Cans#iu-CA-Latn#ja-JP#ja-JP-mac#ka-GE#kk-KZ#kl-GL#km-KH#kn-IN#kok-IN#ko-KR#ky-KG#lb-LU#lo-LA#lt-LT#lug-UG#lv-LV#mi-NZ#mk-MK#ml-IN#mn-CN#mn-MN#moh-CA#mr-IN#ms-BN#ms-MY#mt-MT#nb-NO#ne-NP#nl-BE#nl-NL#nn-NO#nso-ZA#oc-FR#or-IN#pa-IN#pl-PL#ps-AF#pt-BR#pt-PT#qut-GT#quz-BO#quz-EC#quz-PE#rm-CH#ro-RO#ru-RU#rw-RW#sah-RU#sa-IN#se-FI#se-NO#se-SE#si-LK#sk-SK#sl-SI#sma-NO#sma-SE#smj-NO#smj-SE#smn-FI#sms-FI#son-NE#sq-AL#sr-BA-Cyrl#sr-BA-Latn#sr-ME#sr-RS#sv-FI#sv-SE#sw-KE#syr-SY#ta-IN#ta-LK#te-IN#tg-TJ-Cyrl#th-TH#tk-TM#tn-ZA#ur-IN#tr-TR#tt-RU#ug-CN#uk-UA#ur-PK#uz-UZ-Cyrl#uz-UZ-Latn#vi-VN#wa-BE#dsb-DE#hsb-DE#wo-SN#xh-ZA#yo-NG#zh-CHS#zh-CHT#zh-CN#zh-HK#zh-MO#zh-SG#zh-TW#zu-ZA";


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
  
  
 //hide all menu items
 
 var allIndex, allLen;
 
 allLocale = this.ZLS_ALL_LOCALES.split("#");
 allLen = allLocale.length;
 
 for (allIndex = 0; allIndex < allLen; allIndex++) {
 	
 	var allItem = document.getElementById(allLocale[allIndex]);
    allItem.setAttribute("hidden", true);
        
  
}

 //show selected locales 
  var visibleLocale = prefs.getCharPref("extensions.zls.visiblemenuitems");
  var showLocale = visibleLocale.split("#");
        
        var iIndex, iLen;

        iLen = showLocale.length;

        for (iIndex = 0; iIndex < iLen; iIndex++) {
        	
        	//show selected locales
        	if (showLocale[iIndex] !== '') {
        	var item = document.getElementById(showLocale[iIndex]);
	    		item.setAttribute("hidden", false);
	    		
	    		if (zoteroLocale == showLocale[iIndex]) {
	    			item.setAttribute("checked", "true");
	    		}
        	}
        }
	var itemDefault =document.getElementById("defaultZLS");
	if (zoteroLocale == "") {
    			itemDefault.setAttribute("checked", "true");
    		}

}



