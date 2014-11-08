/* ***** BEGIN LICENSE BLOCK *****
Version: MPL 1.1/GPL 2.0/LGPL 2.1

The contents of this file are subject to the Mozilla Public License Version
1.1 (the "License"); you may not use this file except in compliance with
the License. You may obtain a copy of the License at
http://www.mozilla.org/MPL/

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
for the specific language governing rights and limitations under the
License.


Based from Benjamin Smedberg's Quick Locale Switcher http://benjamin.smedbergs.us/switch-locales/
The Initial Developer of the Original Code is Martijn Kooij a.k.a. Captain Caveman.

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

const ZLSDragDropItemObserver =
{ 
	onDragStart: function (evt,transferData,action)
	{
		var sData = evt.target.getAttribute("id");
		transferData.data = new TransferData();
		transferData.data.addDataForFlavour("text/unicode", sData);
	}
};

const ZLSDragDropObserver =
{
	getSupportedFlavours : function ()
	{
		var oFS = new FlavourSet();
		oFS.appendFlavour("text/unicode");
		return oFS;
	},
	
	onDragOver: function (evt,flavour,session)
	{
		session.canDrop = true;
		return true;
	},
	
	onDrop: function (evt,dropdata,session)
	{
		var oElement = evt.target;
		
		var sDroppedLocale = dropdata.data;
		var sTargetLocale = oElement.getAttribute('id');
		
		MoveZLSMenuItem(sDroppedLocale, sTargetLocale);
	}
};

function ZLSDragOver(oEvent)
{
	nsDragAndDrop.dragOver(oEvent, ZLSDragDropObserver);	
}

function ZLSDrop(oEvent)
{
	nsDragAndDrop.drop(oEvent, ZLSDragDropObserver);	
}

function InitWindow()
{
	this.sizeToContent();

	this.oZLSPref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.zls.");
	this.ZLSHostToLocale = null;

	RefreshVisibleMenuItems('');
	ZLSInitHostLocales();
	//InitAutoSwitchListbox();
	
	document.getElementById("lbvisiblemenuitems").addEventListener('dragover', ZLSDragOver, false);
	document.getElementById("lbvisiblemenuitems").addEventListener('dragdrop', ZLSDrop, false);
}



function BeforeClose()
{
	var oObService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	oObService.notifyObservers(opener, "zls-settings", "OK");
    return true;
}

function CheckLocale(sLocale)
{
	var sMItems = GetPref("visiblemenuitems") + "#";
	sMItems = sMItems.replace(sLocale + "#", "", "g");
	if (document.getElementById(sLocale).getAttribute("checked") == "true")
	{
		sMItems += sLocale + "#";
	}
	SetPref("visiblemenuitems", sMItems.substr(0, sMItems.length - 1));
}

function MoveZLSMenuItem(sSource, sTarget)
{
	var sMItems = GetPref("visiblemenuitems") + "#";
	sMItems = sMItems.replace(sSource + "#", "", "g");
	sMItems = sMItems.replace(sTarget + "#", sSource + "#" + sTarget + "#", "g");
	SetPref("visiblemenuitems", sMItems.substr(0, sMItems.length - 1));
	RefreshVisibleMenuItems(document.getElementById("visiblemenuitems-search").value);
	
}

function SelectAllItems(bSelect)
{
	var oList = document.getElementById('lbvisiblemenuitems');
	var oItem;
	var iIndex, iLen;
	
	iLen = oList.getRowCount();
	for (iIndex = 0; iIndex < iLen; iIndex ++)
	{
		oItem = oList.getItemAtIndex(iIndex);
		oItem.setAttribute("checked", bSelect);
		CheckLocale(oItem.id);
	}
}



function Resetlocale()
{
	

    var DefaultLocale = "";
 
    DefaultLocale = GetPref("defaultmenuitems");
  	SetPref("visiblemenuitems", DefaultLocale);
	 
	 
	RefreshVisibleMenuItems('');
}

function DisableSwitchOptions(bDisable)
{
	document.getElementById('switch_gulocale').setAttribute('disabled', bDisable);
	document.getElementById('switch_contentlocale').setAttribute('disabled', bDisable);
}

function DisableStatusBarMode(bDisable)
{
    var oStatusBarMode = document.getElementById('statusbarmode');
	oStatusBarMode.setAttribute('disabled', bDisable);
	oStatusBarMode.childNodes[0].setAttribute('disabled', bDisable);
	oStatusBarMode.childNodes[1].setAttribute('disabled', bDisable);
	oStatusBarMode.childNodes[2].setAttribute('disabled', bDisable);
}

function InitAutoSwitchListbox()
{
	var oList = document.getElementById('lbitems');
	var oItem, oLItem, oCloneItem;
	var sLabel = "";
	var iIndex, iLen = this.ZLSHostToLocale.length;

	RemoveListboxItems();
	
	oCloneItem = document.getElementById('liclone');
	for (iIndex = 0; iIndex < iLen; iIndex ++)
	{	
		if (this.ZLSHostToLocale[iIndex][0] && this.ZLSHostToLocale[iIndex][0] != "")
		{
			oItem = oCloneItem.cloneNode(true);
			oItem.setAttribute('id', 'li_' + iIndex);
			oItem.setAttribute('selected', false);
			oItem.setAttribute('current', false);
			oItem.childNodes[0].setAttribute('hostname', this.ZLSHostToLocale[iIndex][0]);
			sLabel = this.ZLSHostToLocale[iIndex][0];
			oLItem = document.getElementById(this.ZLSHostToLocale[iIndex][1])
			if (oLItem) sLabel += " (" + oLItem.label + ")";
			else sLabel += " (" + this.ZLSHostToLocale[iIndex][1] + ")";
			oItem.childNodes[0].setAttribute('label', sLabel);
			oItem.setAttribute('hidden', false);
			oList.appendChild(oItem);
		}
	}
}

function RefreshVisibleMenuItems(sFilter)
{
	var oConsole = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces["nsIConsoleService"]);
	var oList = document.getElementById('lbvisiblemenuitems');
	var oLItem, oCItem;
	var aMItems = ZLS_ALL_LOCALES.split("#");
	var aVMItems = GetPref("visiblemenuitems").split("#");
	var sVMItems = "";
	var iIndex, iLen = aVMItems.length;
	var bSaveVMItems = false;

	RemoveAllChildren(oList);
	if (sFilter == "") document.getElementById("visiblemenuitems-search").value = "";
	else sFilter = sFilter.toLowerCase();
	
	for (iIndex = 0; iIndex < iLen; iIndex ++)
	{
		oCItem = document.getElementById("clone_" + aVMItems[iIndex]);
		if (oCItem)
		{
			oLItem = oCItem.cloneNode(true);
			if (oLItem.getAttribute('label').toLowerCase().indexOf(sFilter) >= 0 || sFilter == "")
			{
				oLItem.id = oLItem.id.replace("clone_", "");
				oList.appendChild(oLItem);
				oLItem.setAttribute("checked", true);
			}
			sVMItems += aVMItems[iIndex] + "#";
		}
		else
		{
			bSaveVMItems = true;
			//oConsole.logStringMessage("Quick Locale Switcher unsuspected locale: " + aVMItems[iIndex]);
		}
	}
	iLen = aMItems.length;
	for (iIndex = 0; iIndex < iLen; iIndex ++)
	{
		if (!document.getElementById(aMItems[iIndex]))
		{
			oLItem = document.getElementById("clone_" + aMItems[iIndex]).cloneNode(true);
			if (oLItem.getAttribute('label').toLowerCase().indexOf(sFilter) >= 0 || sFilter == "")
			{
				oLItem.id = oLItem.id.replace("clone_", "");
				oList.appendChild(oLItem);
			}
		}
	}
	if (bSaveVMItems)
	{
		SetPref("visiblemenuitems", sVMItems.substr(0, sVMItems.length - 1));
	}
}

function FilterAutoSwitchHosts(sFilter)
{
	var oList = document.getElementById('lbitems');
	var oItem;
	var iIndex, iLen = oList.childNodes.length - 1;

	sFilter	= sFilter.toLowerCase();
	for (iIndex = iLen; iIndex >= 0; iIndex --)
	{
		oItem = oList.childNodes[iIndex];
		if (oItem.nodeName == "richlistitem" && oItem.getAttribute('id') != 'liclone')
		{
			if (oItem.childNodes[0].getAttribute('label').toLowerCase().indexOf(sFilter.toLowerCase()) >= 0 || sFilter == "")
			{
				oItem.setAttribute('hidden', false);
			}
			else
			{
				oItem.setAttribute('hidden', true);
			}
		}
	}
}

function ClearAutoSwitchFilter(bApplyFilter)
{
	document.getElementById('autoswitch-filter').value = '';
	if (bApplyFilter) FilterAutoSwitchHosts('');
}

function RemoveListboxItems()
{
	var oList = document.getElementById('lbitems');
	var oItem;
	var iIndex, iLen = oList.childNodes.length - 1;
	
	for (iIndex = iLen; iIndex >= 0; iIndex --)
	{
		oItem = oList.childNodes[iIndex];
		if (oItem.nodeName == "richlistitem" && oItem.getAttribute('id') != 'liclone') oList.removeChild(oItem);
	}
}

function RemoveAllChildren(oItem)
{
	var iIndex, iLen = oItem.childNodes.length - 1;
	for (iIndex = iLen; iIndex >= 0; iIndex --)
	{
		oItem.removeChild(oItem.childNodes[iIndex]);
	}
}

function RemoveAutoSwitchHosts(bRemoveAll)
{
	var oList = document.getElementById('lbitems');
	var oItem;
	var sURI;
	var iIndex, iLen, iHIndex;
	
	iLen = oList.getRowCount() - 1;
	for (iIndex = iLen; iIndex > -1; iIndex --)
	{
		oItem = oList.getItemAtIndex(iIndex);
		if ((oItem.getAttribute('selected') == "true" || bRemoveAll) && (!oItem.getAttribute('hidden') || oItem.getAttribute('hidden') == "false"))
		{
			iHIndex = GetAutoSwitchIndex(oItem.childNodes[0].getAttribute('hostname'));
			if (iHIndex >= 0)
			{
				this.ZLSHostToLocale.splice(iHIndex, 1);
				oList.removeChild(oItem);
			}
		}
	}
	ClearAutoSwitchFilter(false);
	ZLSStoreHostLocalePref();
	ZLSInitHostLocales();
	InitAutoSwitchListbox();
}

function GetAutoSwitchIndex(sHost)
{
	var iIndex, iLen = this.ZLSHostToLocale.length;

	for (iIndex = 0; iIndex < iLen; iIndex ++)
	{
		if (this.ZLSHostToLocale[iIndex][0] == sHost) return iIndex;
	}
	return -1;
}

function ZLSStoreHostLocalePref()
{
	var aTemp = new Array();
	var sHostLocale = "";
	var iIndex, iLen = this.ZLSHostToLocale.length;
	for (iIndex = 0; iIndex < iLen; iIndex ++)
	{
		aTemp[iIndex] = this.ZLSHostToLocale[iIndex].join(';');
	}
	sHostLocale = aTemp.join(' ');
	SetPref("autoswitchhosts", sHostLocale);
}

function ZLSInitHostLocales()
{
	this.ZLSHostToLocale = null;
	this.ZLSHostToLocale = new Array();
		
	var oItem;
	var aTmp = GetPref("autoswitchhosts").split(' ');
	var iIndex, iLen = aTmp.length;
	for (iIndex = 0; iIndex < iLen; iIndex ++)
	{
		this.ZLSHostToLocale[iIndex] = aTmp[iIndex].split(';');
	}
}







function GetPref(sName)
{
	try {return this.oZLSPref.getComplexValue(sName, Components.interfaces.nsIPrefLocalizedString).data;}
	catch (e) {}
	return this.oZLSPref.getCharPref(sName);
}

function SetPref(sName, sData)
{
	var oPLS = Components.classes["@mozilla.org/pref-localizedstring;1"].createInstance(Components.interfaces.nsIPrefLocalizedString);
	oPLS.data = sData;
	this.oZLSPref.setComplexValue(sName, Components.interfaces.nsIPrefLocalizedString, oPLS);
}

function GetPrefBool(sName)
{
	return this.oZLSPref.getBoolPref(sName);
}

function SetPrefBool(sName, bData)
{
	this.oZLSPref.setBoolPref(sName, bData);
}
