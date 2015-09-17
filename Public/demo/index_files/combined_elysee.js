/****** FILE: elysee/javascript/search.js *****/

function _matchCriterias(data,index,osearch){if(osearch.type&&data.classes[osearch.type].length&&data.classes[osearch.type].indexOf(index)==-1)
return false;if(osearch.type2&&data.types[osearch.type2].length&&data.types[osearch.type2].indexOf(index)==-1)
return false;if(osearch.theme&&data.themes[osearch.theme].length&&data.themes[osearch.theme].indexOf(index)==-1)
return false;if(osearch.date1&&data.index[index][1][1]<osearch.date1)
return false;if(osearch.date2&&data.index[index][1][1]>osearch.date2)
return false;return true;}
function performSearch(data,osearch,cb){var i;var found_res=[];if(osearch.search){var words=removeAccents(osearch.search).replace(new RegExp("[\\s]{2,}|[^a-z0-9]",'g'),' ');words=words.split(' ');osearch.search=[];for(i=0;i<words.length;i++){var word=normalizeSearch(words[i]);if(word.length>2)
osearch.search.push(word);}}
var strdate=osearch.date1;if(strdate){strdate=strdate.split(/\//g);var odate=new Date(strdate[2],strdate[1]-1,strdate[0],0,0,0);osearch.date1=odate.getTime()/1000;}
strdate=osearch.date2;if(strdate){strdate=strdate.split(/\//g);var odate=new Date(strdate[2],strdate[1]-1,strdate[0],23,59,59);osearch.date2=odate.getTime()/1000;}
var found_res2={};if(!osearch.search||!osearch.search.length){for(i=0;i<data.index.length;i++){if(!_matchCriterias(data,i,osearch))
continue;found_res.push(data.index[i]);}}
else{var found_list=null;for(i=0;i<osearch.search.length;i++){if(!data.search[osearch.search[i]]){found_list=false;break;}
if(!found_list)
found_list=data.search[osearch.search[i]];else
found_list=intersect_safe(found_list,data.search[osearch.search[i]]);}
if(found_list){for(i=0;i<found_list.length;i++){if(!_matchCriterias(data,found_list[i],osearch)){continue;}
found_res2[found_list[i]]=1;}
for(i in found_res2){found_res.push(data.index[i]);}}}
found_res.sort(function(a,b){if(a[1][1]>b[1][1])return-1;if(a[1][1]==b[1][1])return 0;return 1;});cb(found_res);}
function displayIndex(data,search_name,entries_index,entries_count,results_selector,pagination_selector,loading_cb){var i,j;var get_vars=getQueryVariables();var search='';var type='';var theme='';var date1='';var date2='';var name='';var is_search=false;var name='';var osearch={'search':'','type':'','type2':'','theme':'','date1':'','date2':''};if(search_name){$(search_name+' input[name=input-search]').val(get_vars['input-search']);$(search_name+' input[name=input-date1]').val(get_vars['input-date1']);$(search_name+' input[name=input-date2]').val(get_vars['input-date2']);$(search_name+' select[name=input-type]').val(get_vars['input-type']);$(search_name+' select[name=input-type2]').val(get_vars['input-type2']);$(search_name+' select[name=input-theme]').val(get_vars['input-theme']);osearch.search=get_vars['input-search'];osearch.type=get_vars['input-type'];osearch.type2=get_vars['input-type2'];osearch.theme=get_vars['input-theme'];osearch.date1=get_vars['input-date1'];osearch.date2=get_vars['input-date2'];if(osearch.date1||osearch.date2){var parent=$(search_name+' input[name=input-date1]').parents('.toggle-box:first');$('.toggle-controler',parent).click();}
is_search=(osearch.search||osearch.type||osearch.type2||osearch.theme||osearch.date1||osearch.date2);}
performSearch(data,osearch,function(found_res){var index=0;if(entries_index==-1){if(get_vars['search_index']){index=parseInt(get_vars['search_index']);}}
else{index=entries_index;}
if(index>=found_res.length||index<0){index=0;}
is_search=(is_search||index);var results=[];for(i=index*entries_count;i<found_res.length;i++){results.push(found_res[i]);if(results.length==entries_count)
break;}
$(results_selector).html('');if(results.length){for(i=0;i<results.length;i++){var content=data['html_index'];for(j=0;j<data['fields'].length;j++){name=data['fields'][j];content=content.replace(new RegExp('\\$'+name,'g'),results[i][1][j]);}
$(results_selector).append(content);var item=$(results_selector+' > *:eq('+i+')');item.addClass('item-'+(i+1));}}
else{$(results_selector).html('<div class="news"><p class="error">Aucun résultat trouvé</p></div>');}
var prev_index=-1;var next_index=-1;var prev_link='';var next_link='';var page=index+1;var page_count=(found_res.length%entries_count)==0?found_res.length/entries_count:parseInt(found_res.length/entries_count)+1;if(index){document.title='Page '+page+' - '+document.title;}
if(index){get_vars['search_index']=prev_index=index-1;prev_link=window.location.pathname+'?'+setQueryVariables(get_vars);}
if(page<page_count){get_vars['search_index']=next_index=index+1;next_link=window.location.pathname+'?'+setQueryVariables(get_vars);}
$(pagination_selector).html('');if(found_res.length&&(prev_link||next_link)){if(prev_link){$(pagination_selector).append('<li class="page-prev"><a href="'+prev_link+'"><img height="18" width="18" alt="Page précédente: page '+(prev_index+1)+'" src="elysee/images/prev.png" class="retina" data-retina="elysee/images/prev-big.png" /></a></li>');}
var start=0;var end=0;if(page_count<=7){end=page_count;}
else{if((index+4)>=page_count){end=page_count;start=page_count-7;}
else if(index>3){end=index+4;start=index-3;}
else{end=7;}}
for(i=start;i<end;i++){if(i==index){$(pagination_selector).append('<li class="page-info on">'+(i+1)+'</li>');}
else{get_vars['search_index']=i;var url=window.location.pathname+'?'+setQueryVariables(get_vars);$(pagination_selector).append('<li class="page-info"><a href="'+url+'" title="Page '+(i+1)+'">'+(i+1)+'</a></li>');}}
if(next_link){$(pagination_selector).append('<li class="page-next"><a href="'+next_link+'"><img height="18" width="18" alt="Page suivante: page '+(next_index+1)+'" src="elysee/images/next.png" class="retina" data-retina="elysee/images/next-big.png" /></a></li>');}}});if(loading_cb)
loading_cb(is_search);}
;
/****** FILE: elysee/javascript/slider.js *****/

function Slider(parent,config){this.parent_selector='';if(typeof parent=='string'){this.parent_selector=parent;parent=$(this.parent_selector);}
if(!parent||!parent.length)
return;var me=this;this.curr_index=0;this.slide_enabled=true;this.view_count=0;this.items_count=0;this.item_width=0;this.hasNav=false;this.locked=false;this.default_config={'showNav':true,'itemWidth':0,'viewCount':0,'defaultIndex':0,'listContainerSelector':'.slides-list','listItemSelector':'.slide','previousCB':null,'nextCB':null,'onBeforeChange':null,'onAfterChange':null,'onChange':null,'maxSwipe':-1,'labelNavPrev':'Voir les entrées précédentes','labelNavNext':'Voir les entrées suivantes','white':false,'vertical':false,'handleFocus':true,'debug':false};if(config){for(var name in config){this.default_config[name]=config[name];}}
this.lock=function(){me.locked=true;}
this.unlock=function(){me.locked=false;}
this.disableSlide=function(){me.slide_enabled=false;}
this.enableSlide=function(){me.slide_enabled=true;}
this.reset=function(){me.curr_index=me.default_config['defaultIndex']?me.default_config['defaultIndex']:0;me.refresh();}
this.refresh=function(){me.calculate();me.showItem(me.curr_index,false);}
this.setOption=function(name,value){me.default_config[name]=value;}
this.calculate=function(){if(me.parent_selector){parent=$(me.parent_selector);}
if(!me.default_config['vertical'])
me.item_width=me.default_config['itemWidth']?me.default_config['itemWidth']:$(me.default_config['listItemSelector']+':visible:eq(2)',parent).outerWidth(true);if(me.default_config['viewCount']){me.view_count=me.default_config['viewCount'];}
else{me.view_count=parent.data(getDisplayType()+'-size');if(!me.view_count){me.view_count=parent.data('size');if(!me.view_count)
me.view_count=Math.ceil($('.slides',parent).width()/me.item_width);}}
me.items_count=parent.data('count')?parent.data('count'):$(me.default_config['listItemSelector'],parent).length;if(me.default_config['showNav']&&me.items_count>me.view_count){me.hasNav=true;me.displayNav();}
else{me.hasNav=false;parent.children('.slides-nav').remove();}
if(me.default_config['debug']){alert('item_width: '+me.item_width+', view_count: '+me.view_count+', items_count:'+me.items_count+', hasNav: '+me.hasNav);}}
this.displayNav=function(){parent.children('.slides-nav').remove();if(window.devicePixelRatio>1){var prev='elysee/images/icon_big/'+(me.default_config['white']?(me.default_config['vertical']?'arrow_t_wh.png':'large_arrow_l_wh.png'):'slides-prev.png');var next='elysee/images/icon_big/'+(me.default_config['white']?(me.default_config['vertical']?'arrow_b_wh.png':'large_arrow_r_wh.png'):'slides-next.png');}
else{var prev='elysee/images/icon/'+(me.default_config['white']?(me.default_config['vertical']?'arrow_t_wh.png':'large_arrow_l_wh.png'):'slides-prev.png');var next='elysee/images/icon/'+(me.default_config['white']?(me.default_config['vertical']?'arrow_b_wh.png':'large_arrow_r_wh.png'):'slides-next.png');}
parent.append('<ul class="slides-nav"><li><button class="slides-nav-btn slides-prev"><img src="'+prev+'" width="18" height="18" alt="'+me.default_config['labelNavPrev']+'" /></button></li><li><button class="slides-nav-btn slides-next"><img src="'+next+'" alt="'+me.default_config['labelNavNext']+'" width="18" height="18" /></button></li></ul>');parent.children('.slides-nav').find('.slides-prev').click(function(){if(me.locked)
return false;me.showItem(me.curr_index-1,true,function(){if(!$('body').hasClass('ie7')){if(me.view_count==1)
$(me.default_config['listItemSelector']+':eq('+me.curr_index+')',parent).focus();else
$(me.default_config['listItemSelector']+':not(.hidden-visibility):first',parent).focus();}
if(me.default_config['previousCB'])
me.default_config['previousCB']();});return false;});parent.children('.slides-nav').find('.slides-next').click(function(){if(me.locked)
return false;me.showItem(me.curr_index+1,true,function(){if(!$('body').hasClass('ie7')){if(me.view_count==1)
$(me.default_config['listItemSelector']+':eq('+me.curr_index+')',parent).focus();else
$(me.default_config['listItemSelector']+':not(.hidden-visibility):last',parent).focus();}
if(me.default_config['nextCB'])
me.default_config['nextCB']();});return false;});me.handleNav();};this.handleNav=function(){if(me.curr_index==0){parent.children('.slides-nav').find('.slides-prev').addClass('off');}
else{parent.children('.slides-nav').find('.slides-prev').removeClass('off');}
if(me.curr_index>=(me.items_count-me.view_count)){parent.children('.slides-nav').find('.slides-next').addClass('off');}
else{parent.children('.slides-nav').find('.slides-next').removeClass('off');}};this.showItem=function(index,slide,cb){if(me.default_config['onBeforeChange'])
me.default_config['onBeforeChange'](me.curr_index);me.viewItem(index,slide,function(){if(me.default_config['onAfterChange'])
me.default_config['onAfterChange'](me.curr_index);if(cb)
cb();})}
this.viewItem=function(index,slide,cb){me.calculate();if(!me.items_count)
return;if(me.default_config['debug']){alert('viewItem('+index+', '+slide+')');}
$(me.default_config['listItemSelector'],parent).removeClass('hidden-visibility');me.selectItem(index);if(!me.default_config['vertical']){if(slide){$(me.default_config['listContainerSelector'],parent).animate({'left':'-'+(me.item_width*me.curr_index)+'px'},500,null,function(){$(me.default_config['listItemSelector']+':lt('+me.curr_index+')',parent).addClass('hidden-visibility');$(me.default_config['listItemSelector']+':gt('+(me.curr_index+me.view_count-1)+')',parent).addClass('hidden-visibility');if(cb)
cb();});}
else{$(me.default_config['listContainerSelector'],parent).css({'left':'-'+(me.item_width*me.curr_index)+'px'});$(me.default_config['listItemSelector']+':lt('+me.curr_index+')',parent).addClass('hidden-visibility');$(me.default_config['listItemSelector']+':gt('+(me.curr_index+me.view_count-1)+')',parent).addClass('hidden-visibility');if(cb)
cb();}}
else{var position=$(me.default_config['listItemSelector']+':eq('+me.curr_index+')',parent).position();if(slide){$(me.default_config['listContainerSelector'],parent).animate({'top':(-position.top)+'px'},500,null,function(){$(me.default_config['listItemSelector']+':lt('+me.curr_index+')',parent).addClass('hidden-visibility');$(me.default_config['listItemSelector']+':gt('+(me.curr_index+me.view_count-1)+')',parent).addClass('hidden-visibility');if(cb)
cb();});}
else{$(me.default_config['listContainerSelector'],parent).css({'top':(-position.top)+'px'});$(me.default_config['listItemSelector']+':lt('+me.curr_index+')',parent).addClass('hidden-visibility');$(me.default_config['listItemSelector']+':gt('+(me.curr_index+me.view_count-1)+')',parent).addClass('hidden-visibility');if(cb)
cb();}}
me.handleNav();}
this.selectItem=function(index){if(!me.items_count)
return;me.curr_index=index;$(me.default_config['listItemSelector'],parent).removeClass('selected-slide');$(me.default_config['listItemSelector']+':eq('+me.curr_index+')',parent).addClass('selected-slide');if(me.default_config['onChange'])
me.default_config['onChange'](me.curr_index);}
this.currentIndex=function(){return me.curr_index;}
this.hasNavigagtion=function(){return me.hasNav;}
this._init=function(){me.reset();parent.live('swipe',function(e,info){if(!me.slide_enabled||me.default_config['vertical'])
return;if(info.start.coords[0]<info.end.coords[0]){var offset=info.end.coords[0]-info.start.coords[0];var move=parseInt(offset/me.item_width);if(!move&&offset>100)
move=1;if(move){if(me.default_config['maxSwipe']!=-1){if(move>me.default_config['maxSwipe'])
move=me.default_config['maxSwipe'];}
me.showItem(me.curr_index-move<0?0:me.curr_index-move,true,me.default_config['nextCB']);}}
else{var offset=info.start.coords[0]-info.end.coords[0];var move=parseInt(offset/me.item_width);if(!move&&offset>100)
move=1;if(move){if(me.default_config['maxSwipe']!=-1){if(move>me.default_config['maxSwipe'])
move=me.default_config['maxSwipe'];}
me.showItem(me.curr_index+move>=me.items_count?me.items_count-1:me.curr_index+move,true,me.default_config['previousCB']);}}
e.stopPropagation();});}
me._init();}
;
/****** FILE: elysee/javascript/agenda.js *****/

var hide_agenda=false;function Agenda(){var me=this;this.agenda_slider=null;this.weeks_slider=null;this.tab_sliders={};this.loading_previous=false;this.current_date='';this.weeks_count=0;this.prev_index=0;this.afterReload=null;this.show=function(date,slide,cb,hideFocus){if(me.loading_previous)
return;me._show(date,slide,cb,hideFocus);}
this._show=function(date,slide,cb,hideFocus){var item=typeof date=='string'?$('#date-'+date):date;if(!item.length)
return;me.current_date=date;me.agenda_slider.showItem(item.data('index')-me.prev_index,slide,function(){if(!hideFocus){me.afterReload=function(){if(me.isDetailed())
$('.agenda-week > .selected-slide > .tab-content:first .slide:first').attr('tabindex','0').focus();else
$('#agenda-'+me.current_date+' .slide:first').attr('tabindex','0').focus();};me.afterReload();}
if(cb)
cb();});}
this._reload=function(){$('.agenda-month').attr('aria-busy','true');$('.agenda-day-details').attr('aria-busy','true');me.loading_previous=true;me.agenda_slider.lock();me.agenda_slider.disableSlide();me.weeks_slider.lock();me.weeks_slider.disableSlide();$('.agenda-month .ajaxload').show();$.get('/home/PreviousAgenda/'+me.weeks_count,null,function(data){$('.agenda').html(data);me.tab_sliders={};me._htmlChanged();me.weeks_count-=4;if(me.weeks_count<0)
me.weeks_count=0;var index=$('#date-'+me.current_date).data('index');me.agenda_slider.viewItem(index-me.prev_index);index=$('#agenda-'+me.current_date).parents('.agenda-week-slide').data('index');me.weeks_slider.viewItem(index);me._manageCurrentDate();if(me.afterReload)
me.afterReload();me.loading_previous=false;me.agenda_slider.unlock();me.agenda_slider.enableSlide();me.weeks_slider.unlock();me.weeks_slider.enableSlide();});}
this._handleReload=function(){var prev=$('#date-'+me.current_date).prevAll('li.slide:eq('+(me.prev_index-1)+'):not(.lastdate).notloaded');if(prev.length){me._reload();return true;}
return false;}
this._manageCurrentDate=function(){if(!me.current_date)
return;var item=$('#date-'+me.current_date);var tab=$('#agenda-'+me.current_date);var adate=me.current_date.split(/-/g);$('#datepicker').val(adate[2]+'/'+adate[1]+'/'+adate[0]);$('.agenda-day .slides-container li').removeClass('on');$('.agenda-day .slides-container li a').attr('aria-selected','false');item.addClass('on');$('a',item).attr('aria-selected','true');$('.agenda-month .month').text($('.month',item).text());$('.agenda-day-details .tab-content').removeClass('on');tab.addClass('on');me._handleTabs();if(!me.isDetailed())
$('.title',tab).readMore();if(!me.tab_sliders[me.current_date]){me.tab_sliders[me.current_date]=new Slider('#agenda-'+me.current_date+' .slides-container');if(me.isDetailed()){me.tab_sliders[me.current_date].disableSlide();$('#agenda-'+me.current_date+' .slides-container .slide').removeClass('hidden-visibility');}}
else{if(me.isDetailed()){me.tab_sliders[me.current_date].disableSlide();$('#agenda-'+me.current_date+' .slides-container .slide').removeClass('hidden-visibility');}
else{me.tab_sliders[me.current_date].enableSlide();me.tab_sliders[me.current_date].reset();}}}
this._daysChanging=function(){if(!me.current_date)
return;$('.agenda-day .slides-container li').removeClass('on');$('.agenda-day .slides-container li a').attr('aria-selected','false');$('.agenda-day .slides-list').addClass('slides-list-loading');}
this._daysChanged=function(){if(!me.current_date)
return;var index=me.agenda_slider.currentIndex();var date=$('.agenda-day .slides-container li:eq('+(index+me.prev_index)+')');if(!date.length)
return;var cdate=date.data('date');if(cdate!=me.current_date)
me.current_date=cdate;var tab=$('#agenda-'+me.current_date);$('.agenda-day .slides-list').removeClass('slides-list-loading');me._manageCurrentDate();if(!me._handleReload()&&me.weeks_slider){var index=tab.parents('.agenda-week-slide').data('index');if(me.weeks_slider.currentIndex()!=index){me.weeks_slider.showItem(index,false);}}}
this._weeksChanged=function(){if(!me.current_date)
return;var active_date=$('.agenda-week > .selected-slide > .tab-content:first').attr('id').substr(7,10);if(active_date==me.current_date)
return;var item=$('#date-'+active_date);if(!item.length)
return;if(item.hasClass('lastdate')&&!item.nextAll(':lt(6)').not('.lastdate').length){me.weeks_slider.showItem(me.weeks_slider.currentIndex()+1,false);return;}
me.current_date=active_date;me.agenda_slider.viewItem(item.data('index')-me.prev_index,false);me._manageCurrentDate();me.afterReload=function(){$('.agenda-week > .selected-slide > .tab-content:first .slide:first').attr('tabindex','0').focus();};me.afterReload();me._handleReload();}
this._weeksCount=function(date){var start=1336993200000;var adate=date.split(/-/g);var odate=new Date(adate[0]+'/'+adate[1]+'/'+adate[2]);var ts=odate.getTime()-start;return parseInt(ts/(7*86400000));}
this._handleTabs=function(){$('.agenda-day-details .tab-content').attr({'aria-hidden':'true','aria-expanded':'false'});if(me.isDetailed()){$('.agenda-week-slides .selected-slide .tab-content').attr({'aria-hidden':'false','aria-expanded':'true'});$('.agenda-week-slide .slide').removeAttr('tabindex');$('.agenda-week-slides .selected-slide .tab-content .slide:first').attr({'tabindex':'0'});}
else{$('.tab-content.on').attr({'aria-hidden':'false','aria-expanded':'true'});$('.tab-content.on .slide').removeAttr('tabindex');$('.tab-content .slide').attr({'tabindex':'-1'});$('.tab-content.on .slide:not(.hidden-visibility)').attr({'tabindex':'0'});}}
this.isDetailed=function(){return $('.agenda').hasClass('on');}
this.isHidden=function(){return(hide_agenda||(getCookie('agenda-state')=='off'));}
this._hideAgenda=function(fade,remember){hide_agenda=true;if(remember)
setCookie('agenda-state','off',30);if(fade){$('.agenda-day').fadeOut();$('.agenda-day-details').fadeOut();}
else{$('.agenda-day').hide();$('.agenda-day-details').hide();}
$('.agenda-state button img').attr({'src':((window.devicePixelRatio>1)?'elysee/images/icon_big/arrow_b_wh.png':'elysee/images/icon/arrow_b_wh.png'),'alt':'Afficher l\'agenda'});$('.agenda-state button').attr({'title':'Afficher l\'agenda'});}
this._showAgenda=function(fade,remember){hide_agenda=false;if(remember)
setCookie('agenda-state','on',30);if(fade){if(!me.isDetailed())
$('.agenda-day').fadeIn();else
$('.agenda-day').show();$('.agenda-day-details').fadeIn();}
else{$('.agenda-day').show();$('.agenda-day-details').show();}
$('.agenda-state button img').attr({'src':((window.devicePixelRatio>1)?'elysee/images/icon_big/arrow_t_wh.png':'elysee/images/icon/arrow_t_wh.png'),'alt':'Masquer l\'agenda'});$('.agenda-state button').attr({'title':'Masquer l\'agenda'});$('.agenda-day,.agenda-day-details').promise().done(function(){me._refresh();});}
this._showDetailed=function(){$('.agenda').addClass('on');if(me.isHidden()){me._showAgenda(false,true);}
var index=$('#agenda-'+me.current_date).parents('.agenda-week-slide').data('index');if(me.weeks_slider.currentIndex()!=index){me.weeks_slider.showItem(index,false);}
$('*[tabindex="0"]').addClass('hastabindex').removeAttr('tabindex');$(':input,a').attr('tabindex','-1');$('a,:input',$('.agenda-day-details,.agenda-month')).removeAttr('tabindex');$('.full-agenda-link a').removeAttr('tabindex');$('.slides-container').filter(function(index){return($(this).parents('.agenda-day-details').length==0);}).addClass('hidden-visibility');$('.agenda-day-details').attr({'role':'dialog'});$('.agenda-day-details .tab-content .title').unreadMore();$('.agenda-month .agenda-close button').show();$('.overlay').show();$('.agenda-day').css({'display':'','visibility':'hidden'});$('.agenda-day-details').show();$('.full-agenda-link').hide();me._handleTabs();$('.agenda-month .agenda-close button').focus();for(var date in me.tab_sliders){me.tab_sliders[date].disableSlide();}
$('.tab-content .slide.hidden-visibility').removeClass('hidden-visibility');}
this._hideDetailed=function(){$('.agenda-close button').hide();$('.full-agenda-link').show()
$('.full-agenda-link a').focus();$('.overlay').hide();$('.agenda').removeClass('on');$('#agenda-'+me.current_date+' .title').readMore();$('.agenda-day').css({'display':'','visibility':''});$('.agenda-day-details').removeAttr('role');$('a,:input').removeAttr('tabindex');$('.hastabindex').removeClass('hastabindex').attr('tabindex','0');$('.slides-container.hidden-visibility').removeClass('hidden-visibility');me._handleTabs();for(var date in me.tab_sliders){me.tab_sliders[date].enableSlide();}}
this._htmlChanged=function(){$('.agenda-month .content').prepend('<p class="agenda-state"><button title="Masquer l\'agenda"><img src="elysee/images/icon/arrow_t_wh.png" class="retina" data-retina="elysee/images/icon_big/arrow_t_wh.png" width="18" height="18" alt="Masquer l\'agenda" /></button></p>');$('.agenda-month .content').append('<div class="agenda-tools"><p class="full-agenda-link"><a class="icon-plus_wh" title="Afficher l\'agenda détaillé" href="Agenda"><span class="icon-arrow_r_wh">Agenda détaillé</span></a></p><p class="agenda-close"><button title="Masquer l\'agenda détaillé" class="off"><img src="elysee/images/close.png" width="18" height="18" class="retina" data-retina="elysee/images/close-big.png" alt="Masquer l\'agenda détaillé" /></button></p><div class="agenda-date-search"><p class="hidden">Une liste des raccourcis clavier pour le calendrier est disponible dans <a href="accessibilite/#raccourcis">la page accessibilité</a>. Lors de la validation d\'une date ou de la sortie du champ, l\'agenda sera automatiquement mis à jour.</p><p class="fields"><input type="text" value="" id="datepicker" aria-haspopup="true" aria-owns="ui-datepicker-div" class="agenda-input icon-datepicker" title="Choisir une date au format jj/mm/aaaa (exemple 25/10/2012)" /></p></div></div>');$('.agenda.on .agenda-month .agenda-close button').show();if(me.isHidden()){me._hideAgenda();}
$('#datepicker').datepicker({'onSelect':function(date,inst){var adate=date.split(/\//g);var odate=new Date(adate[2]+'/'+adate[1]+'/'+adate[0]);date=adate[2]+'-'+adate[1]+'-'+adate[0];var weeks_count=me._weeksCount(date);if(weeks_count<0){weeks_count=0;date='2012-05-14';}
if(weeks_count>=me.weeks_count){me.show(date);}
else{me.weeks_count=weeks_count;me.current_date=date;me._reload();}}});me.agenda_slider.calculate();me.weeks_slider.calculate();$('.agenda-month').attr({'role':'region','aria-live':'polite','aria-busy':'false'});$('.agenda-day-details').attr({'role':'region','aria-live':'polite','aria-busy':'false'});}
this._refresh=function(){var itemWidth=$('.agenda-day .slides-container .slide:visible:first').outerWidth(true);var itemsVisible=parseInt($('.agenda-day .slides').outerWidth(true)/itemWidth);me.prev_index=parseInt(itemsVisible/2);if(!me.agenda_slider){me.agenda_slider=new Slider('.agenda-day .slides-container',{'showNav':false,'itemWidth':itemWidth,'viewCount':itemsVisible,'onBeforeChange':me._daysChanging,'onAfterChange':me._daysChanged,'handleFocus':false});}
else{me.agenda_slider.setOption('itemWidth',itemWidth);me.agenda_slider.setOption('viewCount',itemsVisible);me.agenda_slider.refresh();}
if(!me.weeks_slider){me.weeks_slider=new Slider('.agenda-week-slides',{'listContainerSelector':'.agenda-week','listItemSelector':'.agenda-week-slide','previousCB':me._weeksChanged,'nextCB':me._weeksChanged,'labelNavPrev':'Voir la semaine précédente','labelNavNext':'Voir la semaine suivante','showNav':true,'white':true,'handleFocus':false});}
else{me.weeks_slider.refresh();}}
this._bind=function(){me._refresh();$(window).bind('resizeWidth',function(){var date=me.current_date;me._refresh();if(date){me.show(date,false,null,true);}});$('.agenda-state button').live('click',function(){if(me.isHidden()){me._showAgenda(true,true);}
else{me._hideAgenda(true,true);}
return false;});$('.full-agenda-link a').live('click',function(){me._showDetailed();return false;});$('.agenda-close button').live('click',function(){me._hideDetailed();return false;});$('.agenda-day .slides-container a').live('click',function(){if($(this).parent().hasClass('lastdate'))
return false;me.show($(this).parent().data('date'),true);return false;});$('.overlay').click(function(){$('.agenda-month .agenda-close button').click();});$(document).keyup(function(data){if(data.keyCode==27){if($('.agenda-close button').is(':visible'))
me._hideDetailed();}});me._htmlChanged();}
this._currentDate=function(){var date=new Date();var day=date.getDate();var month=date.getMonth()+1;if(day.toString().length==1)day='0'+day.toString();if(month.toString().length==1)month='0'+month.toString();return date.getFullYear()+'-'+month+'-'+day;}
this._init=function(){if(!$('.agenda').length)
return;me._bind();var date=me._currentDate();me.weeks_count=me._weeksCount(date)-4;me.show(date,false,null,true);}
this._load=function(){if($('#agenda-full').hasClass('needsloading')){$('#agenda-full').removeClass('needsloading');var date=me._currentDate();var weeks_count=me._weeksCount(date);$.get('/home/PreviousAgenda/'+weeks_count,null,function(data){$('.agenda').html(data);me._init();});}
else{this._init();}}
this._load();};
;
/****** FILE: elysee/javascript/site.js *****/

if(!Array.prototype.indexOf){Array.prototype.indexOf=function(elt){var len=this.length>>>0;var from=Number(arguments[1])||0;from=(from<0)?Math.ceil(from):Math.floor(from);if(from<0)
from+=len;for(;from<len;from++){if(from in this&&this[from]===elt)
return from;}
return-1;};}
function intersect_safe(a,b){var ai=0,bi=0;var result=new Array();while(ai<a.length&&bi<b.length){if(a[ai]<b[bi]){ai++;}
else if(a[ai]>b[bi]){bi++;}
else{result.push(a[ai]);ai++;bi++;}}
return result;}
function normalizeSearch(search){if(!search)
return'';search=search.replace(new RegExp("\\s",'g'),"");search=search.replace(new RegExp("\\W",'g'),"");return search;}
function removeAccents(search){if(!search)
return'';var r=search.toLowerCase();r=r.replace(new RegExp("[àáâãäå]",'g'),"a");r=r.replace(new RegExp("æ",'g'),"ae");r=r.replace(new RegExp("ç",'g'),"c");r=r.replace(new RegExp("[èéêë]",'g'),"e");r=r.replace(new RegExp("[ìíîï]",'g'),"i");r=r.replace(new RegExp("ñ",'g'),"n");r=r.replace(new RegExp("[òóôõö]",'g'),"o");r=r.replace(new RegExp("œ",'g'),"oe");r=r.replace(new RegExp("[ùúûü]",'g'),"u");r=r.replace(new RegExp("[ýÿ]",'g'),"y");return r;}
function setQueryVariables(data){var query=[];for(name in data){if(name=='')
continue;query.push(name+'='+encodeURIComponent(data[name]));}
return query.join('&');}
function getQueryVariables(){var data={};var query=window.location.search.substring(1);var vars=query.split("&");for(var i=0;i<vars.length;i++){var pair=vars[i].split("=");data[pair[0]]=decodeURIComponent(pair[1]).replace(/\+/g,' ');}
return data;}
var documentWidth=0;var currentDisplayType='';function getScreenWidth(){return window.innerWidth||$(window).width();}
function handleScreenSize(){var width=getScreenWidth();if(documentWidth!=width){documentWidth=width;var display=getDisplayType();if(display!=currentDisplayType){currentDisplayType=display;$(window).trigger('displayChange');}
$(window).trigger('resizeWidth');}}
function getDisplayType(){if(documentWidth<640)
return'mobile';else if(documentWidth<1024)
return'tablet';return'desktop';}
function colorboxWidth(max){switch(getDisplayType()){case'tablet':if(!max||max>documentWidth)
return 620;return max;default:return max;}}
function fixMobileVideo(video){if(!$(video).parent().is(':visible'))
return;var width=parseInt($(video).attr('width'));var height=parseInt($(video).attr('height'));var ratio=height/width;$(video).attr({'width':1,'height':1}).css({'width':1,'height':1});var width2=$(video).parent().width();var ret={'width':width2,'height':parseInt(width2*ratio)};$(video).attr(ret).css(ret);return ret;}
function loadSocialNetworks(){window.twttr=(function(d,s,id){var t,js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);return window.twttr||(t={_e:[],ready:function(f){t._e.push(f)}});}(document,"script","twitter-wjs"));(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return;}
js=d.createElement(s);js.id=id;js.src="//connect.facebook.net/fr_FR/all.js";fjs.parentNode.insertBefore(js,fjs);}(document,'script','facebook-jssdk'));}
function getTestingURL(urls){if(urls.length==1)
return urls[0];var index=Math.floor(Math.random()*urls.length);return urls[index];}
function setTestingSuccess(name,url){if(_gaq){_gaq.push(['_trackEvent',name,'Success',url]);}}
function setTestingCall(name,url){if(_gaq){_gaq.push(['_trackEvent',name,'Call',url]);}}
function displaySocialNetworksOverlays(){return;var fb_url='/home/promptPageLike3';var tw_url='/home/promptPageFollow';var em_url='/home/promptEmailSubscribe';if(getDisplayType()=='mobile')
return;FB.Event.subscribe('edge.create',function(response){setCookie('pageLiked',1,3650);$.colorbox.close();});window.twttr.ready(function(twttr){twttr.events.bind('follow',function(event){setCookie('pageFollowed',1,3650);$.colorbox.close();});});if(!getCookie('pageLiked')&&!getCookie('promptedPageLike')){$.colorbox({'href':fb_url,'open':true,'transition':'none','onClosed':function(){setCookie('promptedPageLike',1,30);},'width':colorboxWidth(400),'height':360},function(){FB.XFBML.parse(document.getElementById('cboxLoadedContent'));$('#cboxClose').focus();});}
else if(!getCookie('pageFollowed')&&!getCookie('promptedPageFollow')){$.colorbox({'href':tw_url,'open':true,'transition':'none','onClosed':function(){setCookie('promptedPageFollow',1,35);},'width':colorboxWidth(400),'height':360},function(){twttr.widgets.load(document.getElementById('cboxLoadedContent'));$('#cboxClose').focus();});}
else if(!getCookie('emailSubscribed')&&!getCookie('promptedEmailSubscribe')){$.colorbox({'href':em_url,'open':true,'transition':'none','onClosed':function(){setCookie('promptedEmailSubscribe',1,40);},'width':colorboxWidth(460),'height':420},function(){$('#emvForm2').submit(function(){setTimeout(function(){$('#emvForm2').unbind('submit');$('#emvForm2').submit();},500);});$('#cboxClose').focus();});}}
function runSocialNetworksOverlays(){window.fbAsyncInit=function(){FB.init({appId:'250737731706431',status:true,xfbml:true});displaySocialNetworksOverlays();};}
$(document).ready(function(){$.fn.colorbox.settings.current='Photo {current} sur {total}';$.fn.colorbox.settings.previous='précédente';$.fn.colorbox.settings.next='suivante';$.fn.colorbox.settings.close='fermer';$.fn.colorbox.settings.xhrError='Ce contenu n\'a pas pu être chargé.';$.fn.colorbox.settings.imgError='Cette image n\'a pas pu être chargée.';$.fn.colorbox.settings.slideshowStart='commencer le diaporama';$.fn.colorbox.settings.slideshowStop='arrêter le diaporama';$(document).bind('cbox_open',function(){$('#cboxOverlay').show();$('*:focus').addClass('returnfocus');});$(document).bind('cbox_complete',function(){$('*[tabindex="0"]').addClass('hastabindex').removeAttr('tabindex');$(':input,a').attr('tabindex','-1');$('#colorbox').attr({'role':'dialog','tabindex':'0'}).focus();$('#colorbox a,#colorbox :input').removeAttr('tabindex');$('.slides-container').filter(function(index){return($(this).parents('#colorbox').length==0)}).addClass('hidden-visibility');});$(document).bind('cbox_cleanup',function(){$('.slides-container.hidden-visibility').removeClass('hidden-visibility');});$(document).bind('cbox_closed',function(){$('a,:input').removeAttr('tabindex');$.colorbox.remove();$('.hastabindex').removeClass('hastabindex').attr('tabindex','0');$('.returnfocus').removeClass('returnfocus').focus();$('#cboxOverlay').hide();});$('.share-tools-controler').live('click',function(){var container=$(this).parents('.share-tools-container:first');if(!$('.share-tools',container).hasClass('on')){$('.share-tools').removeClass('on');$('.share-tools',container).addClass('on');}
else{$('.share-tools',container).removeClass('on');}
return false;});$(document).click(function(){$('.share-tools').removeClass('on');});$('.news .inside,.index .article').live({'click':function(){var href=$('h3 a',this).attr('href');if(href.substring(0,7)=='http://')
document.location=href;else if(href.substring(0,8)=='https://')
document.location=href;else if(href.substring(0,1)=='/')
document.location=href;else
document.location='/'+href;return false;},'mouseenter':function(){$(this).addClass('hover');},'mouseleave':function(){$(this).removeClass('hover');}});$('.pages-list a[data-popupcontent]').live({'click':function(){var _this=$(this);if(getDisplayType()=='mobile')
return;$.colorbox({'html':_this.data('popupcontent'),'open':true,'transition':'none','onClosed':function(){_this.focus();},'width':colorboxWidth(976),},function(){$('#cboxLoadedContent .videocontainer').each(function(){var size=fixMobileVideo(this);$.colorbox.resize({'innerWidth':size.width,'innerHeight':size.height});});if(_gaq)
_gaq.push(['_trackPageview',_this.attr('href')]);});return false;}});$('.news .inside *:not(.share),.index .article *:not(.share),.news .inside *:not(.share) *,.index .article *:not(.share) *').live({'click':function(){var _this=$(this);var parent=$(this).parents('.inside:first,.article:first');if(getDisplayType()!='mobile'&&parent.hasClass('inside-video')){$.colorbox({'href':parent.data('popup'),'open':true,'transition':'none','onClosed':function(){_this.focus();},'width':colorboxWidth(976)},function(){$('#cboxLoadedContent .videocontainer').each(function(){fixMobileVideo(this);});if(_gaq&&parent.data('ga'))
_gaq.push(['_trackPageview',parent.data('ga')]);related_slider=new Slider($('#cboxLoadedContent .feature-sidebar-slider .slides-container'),{'listItemSelector':'.slides-list > li','white':true,'vertical':true});});}
else{var href=$('h3 a',parent).attr('href');if(href.substring(0,7)=='http://')
document.location=href;else if(href.substring(0,8)=='https://')
document.location=href;else if(href.substring(0,1)=='/')
document.location=href;else
document.location='/'+href;}
return false;}});$('#contact-button').click(function(){if(currentDisplayType=='mobile')
return;$.colorbox({'inline':true,'href':'#newsletter-form','width':colorboxWidth(700)});return false;});$('#header .tab-nav a').click(function(){if($(this).hasClass('on')){$('#header .tab-nav a').removeClass('on');$('#header .tab').removeClass('on');if($(this).parent().hasClass('tab-nav-link-1'))
$(this).attr('title','Afficher le menu de navigation');else
$('img',this).attr('alt','Afficher la zone de recherche');}
else{$('#header .tab-nav a').removeClass('on');$('#header .tab').removeClass('on');$($(this).attr('href')).addClass('on').focus();$(this).addClass('on');if($(this).parent().hasClass('tab-nav-link-1'))
$(this).attr('title','Cacher le menu de navigation');else
$('img',this).attr('alt','Cacher la zone de recherche');}
return false;});if(window.devicePixelRatio>1||document.location.hash=='#retina'){$('img.retina').livequery(function(){$(this).attr('src',$(this).data('retina'));});}
$('form.emvForm').submit(validForm);handleScreenSize();$(window).bind('resize orientationchange',handleScreenSize);$(window).bind('displayChange',function(){baseline();});$('.videocontainer,.live iframe,.live object,.live embed,.storifyitem iframe,.storifyitem object,.storifyitem embed').livequery(function(){fixMobileVideo(this);});$('a.highslide').livequery(function(){$(this).unbind('click').click(function(){hs.expand(this,{src:$(this).attr('href')});hs.doFullExpand();});});$(window).bind('resizeWidth',function(){$('.videocontainer,.live iframe,.live object,.live embed').each(function(){fixMobileVideo(this);});});$('#nav-item-1862 a').click(function(){if(currentDisplayType=='mobile'){document.location='http://ecrire.elysee.fr/epr/form/';return false;}});$('.themesnews').each(function(){var container=$(this);var src=container.data('src');if(!src)
return;var id=container.attr('id');$.get(src,null,function(data){container.html(data);new Slider('#'+id+' .nonstop .slides-container',{'handleFocus':true});});});$('.magazinenews').each(function(){var container=$(this);var src=container.data('src');if(!src)
return;$.get(src,null,function(data){container.html(data);});});if(document.location.hash=='#listen'){$('.icon-listen-bl').click();}
new Agenda();});
;
/****** FILE: elysee/javascript/emv.js *****/

function isEmail(emailAddress){var emailAddressValue=emailAddress.val().toLowerCase().trim();var countryTLDs=/^(ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cat|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$/;var gTLDs=/^(aero|asia|biz|cat|com|coop|edu|geo|gov|info|int|jobs|mil|mobi|museum|name|net|org|post|pro|tel|travel)$/;var basicAddress=/^(.+)@(.+)$/;var specialChars='\\(\\)><@,;:\\\\\\\"\\.\\[\\]';var validChars='\[^\\s'+specialChars+'\]';var validCharset='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz��0123456789\'-_.+';var quotedUser='(\"[^\"]*\")';var atom=validChars+'+';var word='('+atom+'|'+quotedUser+')';var validUser=new RegExp('^'+word+'(\.'+word+')*$');var symDomain=new RegExp('^'+atom+'(\.'+atom+')*$');var matchArray=emailAddressValue.match(basicAddress);if(matchArray==null){emailAddress.parent().append('<span class="error">L\'adresse Email semble incorrecte,\nveuillez vérifier la syntaxe.</span>');emailAddress.focus();return false;}else{var user=matchArray[1];var domain=matchArray[2];for(i=0;i<user.length;i++){if(validCharset.indexOf(user.charAt(i))==-1){emailAddress.parent().append('<span class="error">L\'adresse Email contient des caractères invalides,\nveuillez vérifier la partie avant l\'arobase.</span>');emailAddress.focus();return false;}}
for(i=0;i<domain.length;i++){if(validCharset.indexOf(domain.charAt(i))==-1){emailAddress.parent().append('<span class="error">L\'adresse Email contient des caractères invalides,\nveuillez vérifier la partie après l\'arobase.</span>');emailAddress.focus();return false;}}
if(user.match(validUser)==null){emailAddress.parent().append('<span class="error">L\'adresse Email semble incorrecte,\nveuillez vérifier la partie avant l\'arobase.</span>');emailAddress.focus();return false;}
var atomPat=new RegExp('^'+atom+'$');var domArr=domain.split('.');var len=domArr.length;for(i=0;i<len;i++){if(domArr[i].search(atomPat)==-1){emailAddress.parent().append('<span class="error">L\'adresse Email semble incorrecte,\nveuillez vérifier la partie apr�s l\'arobase.</span>');emailAddress.focus();return false;}}
if((domArr[domArr.length-1].length==2)&&(domArr[domArr.length-1].search(countryTLDs)==-1)){emailAddress.parent().append('<span class="error">L\'adresse Email semble incorrecte,\nveuillez vérifier le suffixe du domaine.</span>');emailAddress.focus();return false;}
if((domArr[domArr.length-1].length>2)&&(domArr[domArr.length-1].search(gTLDs)==-1)){emailAddress.parent().append('<span class="error">L\'adresse Email semble incorrecte,\nveuillez vérifier le suffixe du domaine.</span>');emailAddress.focus();return false;}
if((domArr[domArr.length-1].length<2)||(domArr[domArr.length-1].length>6)){emailAddress.parent().append('<span class="error">L\'adresse Email semble incorrecte,\nveuillez vérifier le suffixe du domaine.</span>');emailAddress.focus();return false;}
if(len<2){emailAddress.parent().append('<span class="error">L\'adresse Email semble incorrecte.</span>');emailAddress.focus();return false;}}
return true;}
String.prototype.trim=function(){return this.replace(/^\s*(\b.*\b|)\s*$/,"$1");}
function mandatoryText(input){if(input.val().trim()==''){input.parent().append('<span class="error">Veuillez saisir votre adresse email.</span>');input.focus();return false;}else{return true;}}
function validForm(){$('label .error',this).remove();if(!mandatoryText($('input[name=EMAIL_FIELD]',this)))return false;if(!isEmail($('input[name=EMAIL_FIELD]',this)))return false;}
;
/****** FILE: elysee/javascript/_before.js *****/

var BrowserDetect={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS";},searchString:function(data){for(var i=0;i<data.length;i++){var dataString=data[i].string;var dataProp=data[i].prop;this.versionSearchString=data[i].versionSearch||data[i].identity;if(dataString){if(dataString.indexOf(data[i].subString)!=-1)
return data[i].identity;}
else if(dataProp)
return data[i].identity;}},searchVersion:function(dataString){var index=dataString.indexOf(this.versionSearchString);if(index==-1)return;return parseFloat(dataString.substring(index+this.versionSearchString.length+1));},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};BrowserDetect.init();var classes=" js",addclass="class",html=document.getElementsByTagName("html")[0],htmlclass=html.className;if(BrowserDetect.OS=="Mac")classes+=" mac";if(BrowserDetect.OS=="Linux")classes+=" lin";if(BrowserDetect.OS=="Windows")classes+=" win";if(BrowserDetect.browser=="Chrome")classes+=" ch";if(BrowserDetect.browser=="Firefox")classes+=" fx";if(BrowserDetect.browser=="Opera")classes+=" op";if(BrowserDetect.browser=="Safari")classes+=" sa";if(BrowserDetect.browser=="Explorer")
{document.createElement("abbr");if(!(document.querySelector))addclass="className";}
if(BrowserDetect.OS=="iPhone"||BrowserDetect.OS=="iPod"||BrowserDetect.OS=="iPad")
{switch(window.orientation){case 0:classes+=" portrait";break;case 180:classes+=" portrait";break;case-90:classes+=" landscape";break;case 90:classes+=" landscape";break;}
if(BrowserDetect.OS=="iPad")
{classes+=" ipad ios";}
if(BrowserDetect.OS=="iPod"||BrowserDetect.OS=="iPhone")
{classes+=" iphone ios";}}
if(htmlclass)
{htmlclass=htmlclass.replace('no-js','');}
html.setAttribute(addclass,htmlclass+classes);
;
/****** FILE: elysee/javascript/_after.js *****/

function setCookie(name,value,days){if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires="; expires="+date.toGMTString();}
else var expires="";document.cookie=name+"="+value+expires+"; path=/";}
function getCookie(name){var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)return c.substring(nameEQ.length,c.length);}
return null;}
function deleteCookie(name){setCookie(name,"",-1);}
(function($){$.baseline=function(el){var pre='#id-',unit='em',txt='&nbsp;',box='<div />',prop='min-height';rand=Math.floor(Math.random()*10000),elem=jQuery(box).attr('id',pre.substr(1)+rand).append(txt),base=$(el);base.after(elem);var test=jQuery(pre+rand),hTestPx=test.height(),hBasePx=base.height();test.height(1+unit);var hTestEm=test.height();test.remove();var remainder=hBasePx%hTestPx,division=(hBasePx-remainder)/hTestPx,hBaseEm=hTestPx/hTestEm;if(remainder!=0){var result=(division+1)*hBaseEm+unit;if($.browser.msie&&parseInt($.browser.version,10)==6)
base.parent().height(result);else
base.parent().css(prop,result);base.parent().addClass('baseline');}};$.fn.baseline=function(){return this.each(function(){(new $.baseline(this));});};$.readMore=function(el){var jEvent=$(el),jClassOn='read-more',jClassOff='read-less',jIndex=jEvent.index(),jImgMore=window.devicePixelRatio>1?'elysee/images/read-more-big.png':'elysee/images/read-more.png',jImgLess=window.devicePixelRatio>1?'elysee/images/read-less-big.png':'elysee/images/read-less.png',jVerbMore="Afficher la suite",jVerbLess="Masquer la suite",jTempBtn=$('<button class="read '+jClassOn+'"><img src="'+jImgMore+'" alt="'+jVerbMore+'" /></button>'),jAgenda=$('.agenda');jEvent.each(function(){var jThis=$(this),jHeight=jThis.height(),jSlide=jThis.parents('.slide');jShare=$('.share',jSlide);if(jSlide.hasClass('minify'))
return;if(jHeight>36&&!jAgenda.hasClass('on')){jSlide.addClass('minify');jTempBtn.insertBefore(jShare);var jBtn=$('.'+jClassOn,jSlide);jBtn.unbind('click').click(function(e){e.preventDefault();if(!jSlide.hasClass('on')){jSlide.addClass('on');jBtn.removeClass(jClassOn).addClass(jClassOff).find('img').attr('src',jImgLess).attr('alt',jVerbLess);}else{jSlide.removeClass('on');jBtn.removeClass(jClassOff).addClass(jClassOn).find('img').attr('src',jImgMore).attr('alt',jVerbMore);}});}});};$.unreadMore=function(el){var jEvent=$(el);jEvent.each(function(){var jThis=$(this),jSlide=jThis.parents('.slide');jSlide.removeClass('minify');$('button.read',jSlide).remove();});};$.fn.readMore=function(){return this.each(function(){(new $.readMore(this));});};$.fn.unreadMore=function(){return this.each(function(){(new $.unreadMore(this));});};function setCookie(name,value,days){if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires="; expires="+date.toGMTString();}
else var expires="";document.cookie=name+"="+value+expires+"; path=/";}
function getCookie(name){var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)return c.substring(nameEQ.length,c.length);}
return null;}
function deleteCookie(name){setCookie(name,"",-1);}
$.legibility=function(el){var jThis=$(el);jThis.prepend('<li><button class="larger-txt"><img src="'+(window.devicePixelRatio>1?'elysee/images/larger_text_bl-big.png':'elysee/images/larger_text_bl.png')+'" alt="Agrandir la taille du texte" width="29" height="18" /></button></li>'+'<li><button class="smaller-txt"><img src="'+(window.devicePixelRatio>1?'elysee/images/smaller_text_bl-big.png':'elysee/images/smaller_text_bl.png')+'" alt="Réduire la taille du texte" width="19" height="18" /></button></li>');var scale=[0,1,2,3,4],taille=scale.length,pos=(taille-1)/2,id,jBtns=jThis.find('.larger-txt,.smaller-txt'),jPlusBtn=jThis.find('.larger-txt'),jLessBtn=jThis.find('.smaller-txt');if(!window.localStorage){id=getCookie('legibility');}else{id=localStorage.getItem('legibility');}
if(id){$('body').attr('id',id);pos=parseInt(id.replace('scale-',''));if(pos==0){jLessBtn.addClass('disabled').attr('aria-disabled','true').prop('disabled',true);}else if(pos==(taille-1)){jPlusBtn.addClass('disabled').attr('aria-disabled','true').prop('disabled',true);}}
jBtns.on('click',function(){jBtns.removeClass('disabled').removeAttr('aria-disabled').prop('disabled',false);if($(this).hasClass('smaller-txt')){if(pos>0){pos--;}
if(pos==0)
{jLessBtn.addClass('disabled').attr('aria-disabled','true').prop('disabled',true);}}else{if(pos<(taille-1)){pos++;}
if(pos==(taille-1)){jPlusBtn.addClass('disabled').attr('aria-disabled','true').prop('disabled',true)}}
$('body').removeAttr('id').attr('id','scale-'+pos);if(!window.localStorage){setCookie('legibility','scale-'+pos,365);}else{localStorage.setItem('legibility','scale-'+pos);}});}
$.fn.legibility=function(){return this.each(function(){(new $.legibility(this));});};$.sharePlus=function(el){var jControlers=$(el);jControlers.each(function(){var jControler=$(this),jSharePlus=$(jControler.attr('href'));jControler.on('click',function(e){e.preventDefault();e.stopPropagation();if(!jSharePlus.hasClass('on')){jSharePlus.addClass('on');}else{jSharePlus.removeClass('on');}});$(document).click(function(){jSharePlus.removeClass('on');});});}
$.fn.sharePlus=function(){return this.each(function(){(new $.sharePlus(this));});};$.datepicker.regional['fr']={clearText:'Effacer',clearStatus:'',closeText:'Fermer',closeStatus:'Fermer sans modifier',prevText:'&lt;Préc',prevStatus:'Voir le mois précédent',nextText:'Suiv&gt;',nextStatus:'Voir le mois suivant',currentText:'Courant',currentStatus:'Voir le mois courant',monthNames:['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],monthNamesShort:['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],monthStatus:'Voir un autre mois',yearStatus:'Voir un autre année',weekHeader:'Sm',weekStatus:'',dayNames:['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],dayNamesShort:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],dayNamesMin:['Di','Lu','Ma','Me','Je','Ve','Sa'],dayStatus:'Utiliser DD comme premier jour de la semaine',dateStatus:'Choisir le DD, MM d',dateFormat:'dd/mm/yy',firstDay:0,initStatus:'Choisir la date',isRTL:false};$.datepicker.setDefaults($.datepicker.regional['fr']);$.toggleBox=function(el){var jBoxes=$(el);jBoxes.each(function(){var jBox=$(this),jControler=jBox.find('.toggle-controler'),jTarget=$(jControler.attr('href'));jControler.on('click',function(e){e.preventDefault();e.stopPropagation();if(!jBox.hasClass('on')){$('.hidden',jControler).html('Masquer l\'option : ');jBox.addClass('on');}else{$('.hidden',jControler).html('Afficher l\'option : ');jBox.removeClass('on');}});jTarget.click(function(e){e.stopPropagation();});});}
$.fn.toggleBox=function(){return this.each(function(){(new $.toggleBox(this));});};$.IEplaceholders=function(el){$(el).each(function(){var jInput=jQuery(this),jPlaceholder=jInput.attr('placeholder');if(jInput.val()==''){jInput.addClass('placeholder').val(jPlaceholder);}
jInput.focus(function(){if(jInput.val()==jPlaceholder){jInput.val('').removeClass('placeholder');}}).blur(function(){if(jInput.val()==''){jInput.val(jPlaceholder).addClass('placeholder');}});jInput.parents('form').submit(function(){$(this).find('[placeholder]').each(function(){var jInput=$(this);if(jInput.val()==jInput.attr('placeholder')){jInput.val('');}});});});}
$.fn.IEplaceholders=function(){return this.each(function(){(new $.IEplaceholders(this));});};$.fn.equalizeHeight=function(){var maxHeight=0;return this.each(function(){if($(this).height()>maxHeight){maxHeight=$(this).height();}}).height(maxHeight);};})(jQuery);function baseline(){var selector='.news .title,.media .title,blockquote p,.article .title,.event-related .box-title,.feature .box-title,.feature-related .box-header .title,.caption .title';$('.baseline').removeClass('baseline').css('min-height','')
$(selector).baseline();}
jQuery(function(){var isIE=$('body').hasClass('ie'),isIE7=$('body').hasClass('ie7'),isIE8=$('body').hasClass('ie8');baseline();$('.post-tools-above .tools').legibility();$('.toggle-box').toggleBox();if(isIE){$('input[placeholder]').IEplaceholders();}
if(isIE7){$('.medialib-latest-news .searchResults .news').equalizeHeight();}
var jMenu=$('#menu'),jMenuLink=$('.menu-link');jMenuLink.click(function(e){e.preventDefault();jMenuLink.toggleClass('on');jMenu.toggleClass('on');});});
;
/****** FILE: elysee/javascript/jquery.livequery.js *****/

(function($){$.extend($.fn,{livequery:function(type,fn,fn2){var self=this,q;if($.isFunction(type))
fn2=fn,fn=type,type=undefined;$.each($.livequery.queries,function(i,query){if(self.selector==query.selector&&self.context==query.context&&type==query.type&&(!fn||fn.$lqguid==query.fn.$lqguid)&&(!fn2||fn2.$lqguid==query.fn2.$lqguid))
return(q=query)&&false;});q=q||new $.livequery(this.selector,this.context,type,fn,fn2);q.stopped=false;q.run();return this;},expire:function(type,fn,fn2){var self=this;if($.isFunction(type))
fn2=fn,fn=type,type=undefined;$.each($.livequery.queries,function(i,query){if(self.selector==query.selector&&self.context==query.context&&(!type||type==query.type)&&(!fn||fn.$lqguid==query.fn.$lqguid)&&(!fn2||fn2.$lqguid==query.fn2.$lqguid)&&!this.stopped)
$.livequery.stop(query.id);});return this;}});$.livequery=function(selector,context,type,fn,fn2){this.selector=selector;this.context=context;this.type=type;this.fn=fn;this.fn2=fn2;this.elements=[];this.stopped=false;this.id=$.livequery.queries.push(this)-1;fn.$lqguid=fn.$lqguid||$.livequery.guid++;if(fn2)fn2.$lqguid=fn2.$lqguid||$.livequery.guid++;return this;};$.livequery.prototype={stop:function(){var query=this;if(this.type)
this.elements.unbind(this.type,this.fn);else if(this.fn2)
this.elements.each(function(i,el){query.fn2.apply(el);});this.elements=[];this.stopped=true;},run:function(){if(this.stopped)return;var query=this;var oEls=this.elements,els=$(this.selector,this.context),nEls=els.not(oEls);this.elements=els;if(this.type){nEls.bind(this.type,this.fn);if(oEls.length>0)
$.each(oEls,function(i,el){if($.inArray(el,els)<0)
$.event.remove(el,query.type,query.fn);});}
else{nEls.each(function(){query.fn.apply(this);});if(this.fn2&&oEls.length>0)
$.each(oEls,function(i,el){if($.inArray(el,els)<0)
query.fn2.apply(el);});}}};$.extend($.livequery,{guid:0,queries:[],queue:[],running:false,timeout:null,checkQueue:function(){if($.livequery.running&&$.livequery.queue.length){var length=$.livequery.queue.length;while(length--)
$.livequery.queries[$.livequery.queue.shift()].run();}},pause:function(){$.livequery.running=false;},play:function(){$.livequery.running=true;$.livequery.run();},registerPlugin:function(){$.each(arguments,function(i,n){if(!$.fn[n])return;var old=$.fn[n];$.fn[n]=function(){var r=old.apply(this,arguments);$.livequery.run();return r;}});},run:function(id){if(id!=undefined){if($.inArray(id,$.livequery.queue)<0)
$.livequery.queue.push(id);}
else
$.each($.livequery.queries,function(id){if($.inArray(id,$.livequery.queue)<0)
$.livequery.queue.push(id);});if($.livequery.timeout)clearTimeout($.livequery.timeout);$.livequery.timeout=setTimeout($.livequery.checkQueue,20);},stop:function(id){if(id!=undefined)
$.livequery.queries[id].stop();else
$.each($.livequery.queries,function(id){$.livequery.queries[id].stop();});}});$.livequery.registerPlugin('append','prepend','after','before','wrap','attr','removeAttr','addClass','removeClass','toggleClass','empty','remove','html');$(function(){$.livequery.play();});})(jQuery);
;
/****** FILE: elysee/javascript/jquery.scrollTo.js *****/
;(function($){var $scrollTo=$.scrollTo=function(target,duration,settings){$(window).scrollTo(target,duration,settings);};$scrollTo.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1};$scrollTo.window=function(scope){return $(window)._scrollable();};$.fn._scrollable=function(){return this.map(function(){var elem=this,isWin=!elem.nodeName||$.inArray(elem.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)
return elem;var doc=(elem.contentWindow||elem).document||elem.ownerDocument||elem;return $.browser.safari||doc.compatMode=='BackCompat'?doc.body:doc.documentElement;});};$.fn.scrollTo=function(target,duration,settings){if(typeof duration=='object'){settings=duration;duration=0;}
if(typeof settings=='function')
settings={onAfter:settings};if(target=='max')
target=9e9;settings=$.extend({},$scrollTo.defaults,settings);duration=duration||settings.speed||settings.duration;settings.queue=settings.queue&&settings.axis.length>1;if(settings.queue)
duration/=2;settings.offset=both(settings.offset);settings.over=both(settings.over);return this._scrollable().each(function(){var elem=this,$elem=$(elem),targ=target,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break;}
targ=$(targ,this);case'object':if(targ.is||targ.style)
toff=(targ=$(targ)).offset();}
$.each(settings.axis.split(''),function(i,axis){var Pos=axis=='x'?'Left':'Top',pos=Pos.toLowerCase(),key='scroll'+Pos,old=elem[key],max=$scrollTo.max(elem,axis);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(settings.margin){attr[key]-=parseInt(targ.css('margin'+Pos))||0;attr[key]-=parseInt(targ.css('border'+Pos+'Width'))||0;}
attr[key]+=settings.offset[pos]||0;if(settings.over[pos])
attr[key]+=targ[axis=='x'?'width':'height']()*settings.over[pos];}else{var val=targ[pos];attr[key]=val.slice&&val.slice(-1)=='%'?parseFloat(val)/100*max:val;}
if(/^\d+$/.test(attr[key]))
attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&settings.queue){if(old!=attr[key])
animate(settings.onAfterFirst);delete attr[key];}});animate(settings.onAfter);function animate(callback){$elem.animate(attr,duration,settings.easing,callback&&function(){callback.call(this,target,settings);});};}).end();};$scrollTo.max=function(elem,axis){var Dim=axis=='x'?'Width':'Height',scroll='scroll'+Dim;if(!$(elem).is('html,body'))
return elem[scroll]-$(elem)[Dim.toLowerCase()]();var size='client'+Dim,html=elem.ownerDocument.documentElement,body=elem.ownerDocument.body;return Math.max(html[scroll],body[scroll])
-Math.min(html[size],body[size]);};function both(val){return typeof val=='object'?val:{top:val,left:val};};})(jQuery);
;
/****** FILE: elysee/javascript/jquery.colorbox.js *****/

(function($,document,window){var
defaults={transition:"elastic",speed:300,width:false,initialWidth:"600",innerWidth:false,maxWidth:false,height:false,initialHeight:"450",innerHeight:false,maxHeight:false,scalePhotos:true,scrolling:true,inline:false,html:false,iframe:false,fastIframe:true,photo:false,href:false,title:false,rel:false,opacity:0.9,preloading:true,current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",open:false,returnFocus:true,reposition:true,loop:true,slideshow:false,slideshowAuto:true,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",onOpen:false,onLoad:false,onComplete:false,onCleanup:false,onClosed:false,overlayClose:true,escKey:true,arrowKey:true,top:false,bottom:false,left:false,right:false,fixed:false,data:undefined},colorbox='colorbox',prefix='cbox',boxElement=prefix+'Element',event_open=prefix+'_open',event_load=prefix+'_load',event_complete=prefix+'_complete',event_cleanup=prefix+'_cleanup',event_closed=prefix+'_closed',event_purge=prefix+'_purge',isIE=!$.support.opacity&&!$.support.style,isIE6=isIE&&!window.XMLHttpRequest,event_ie6=prefix+'_IE6',$overlay,$box,$wrap,$content,$topBorder,$leftBorder,$rightBorder,$bottomBorder,$related,$window,$loaded,$loadingBay,$loadingOverlay,$title,$current,$slideshow,$next,$prev,$close,$groupControls,settings,interfaceHeight,interfaceWidth,loadedHeight,loadedWidth,element,index,photo,open,active,closing,loadingTimer,publicMethod,div="div",init;function $tag(tag,id,css){var element=document.createElement(tag);if(id){element.id=prefix+id;}
if(css){element.style.cssText=css;}
return $(element);}
function getIndex(increment){var
max=$related.length,newIndex=(index+increment)%max;return(newIndex<0)?max+newIndex:newIndex;}
function setSize(size,dimension){return Math.round((/%/.test(size)?((dimension==='x'?winWidth():winHeight())/100):1)*parseInt(size,10));}
function isImage(url){return settings.photo||/\.(gif|png|jp(e|g|eg)|bmp|ico)((#|\?).*)?$/i.test(url);}
function winWidth(){return window.innerWidth||$window.width();}
function winHeight(){return window.innerHeight||$window.height();}
function makeSettings(){var i,data=$.data(element,colorbox);if(data==null){settings=$.extend({},defaults);if(console&&console.log){console.log('Error: cboxElement missing settings object');}}else{settings=$.extend({},data);}
for(i in settings){if($.isFunction(settings[i])&&i.slice(0,2)!=='on'){settings[i]=settings[i].call(element);}}
settings.rel=settings.rel||element.rel||'nofollow';settings.href=settings.href||$(element).attr('href');settings.title=settings.title||element.title;if(typeof settings.href==="string"){settings.href=$.trim(settings.href);}}
function trigger(event,callback){$.event.trigger(event);if(callback){callback.call(element);}}
function slideshow(){var
timeOut,className=prefix+"Slideshow_",click="click."+prefix,start,stop,clear;if(settings.slideshow&&$related[1]){start=function(){$slideshow.text(settings.slideshowStop).unbind(click).bind(event_complete,function(){if(settings.loop||$related[index+1]){timeOut=setTimeout(publicMethod.next,settings.slideshowSpeed);}}).bind(event_load,function(){clearTimeout(timeOut);}).one(click+' '+event_cleanup,stop);$box.removeClass(className+"off").addClass(className+"on");timeOut=setTimeout(publicMethod.next,settings.slideshowSpeed);};stop=function(){clearTimeout(timeOut);$slideshow.text(settings.slideshowStart).unbind([event_complete,event_load,event_cleanup,click].join(' ')).one(click,function(){publicMethod.next();start();});$box.removeClass(className+"on").addClass(className+"off");};if(settings.slideshowAuto){start();}else{stop();}}else{$box.removeClass(className+"off "+className+"on");}}
function launch(target){if(!closing){element=target;makeSettings();$related=$(element);index=0;if(settings.rel!=='nofollow'){$related=$('.'+boxElement).filter(function(){var data=$.data(this,colorbox),relRelated;if(data){relRelated=data.rel||this.rel;}
return(relRelated===settings.rel);});index=$related.index(element);if(index===-1){$related=$related.add(element);index=$related.length-1;}}
if(!open){open=active=true;$box.show();if(settings.returnFocus){$(element).blur().one(event_closed,function(){$(this).focus();});}
$overlay.css({"opacity":+settings.opacity,"cursor":settings.overlayClose?"pointer":"auto"}).show();settings.w=setSize(settings.initialWidth,'x');settings.h=setSize(settings.initialHeight,'y');publicMethod.position();if(isIE6){$window.bind('resize.'+event_ie6+' scroll.'+event_ie6,function(){$overlay.css({width:winWidth(),height:winHeight(),top:$window.scrollTop(),left:$window.scrollLeft()});}).trigger('resize.'+event_ie6);}
trigger(event_open,settings.onOpen);$groupControls.add($title).hide();$close.html(settings.close).show();}
publicMethod.load(true);}}
function appendHTML(){if(!$box&&document.body){init=false;$window=$(window);$box=$tag(div).attr({id:colorbox,'class':isIE?prefix+(isIE6?'IE6':'IE'):''}).hide();$overlay=$tag(div,"Overlay",isIE6?'position:absolute':'').hide();$loadingOverlay=$tag(div,"LoadingOverlay").add($tag(div,"LoadingGraphic"));$wrap=$tag(div,"Wrapper");$content=$tag(div,"Content").append($loaded=$tag(div,"LoadedContent",'width:0; height:0; overflow:hidden'),$title=$tag(div,"Title"),$current=$tag(div,"Current"),$next=$tag(div,"Next"),$prev=$tag(div,"Previous"),$slideshow=$tag(div,"Slideshow").bind(event_open,slideshow),$close=$tag('a',"Close"));$wrap.append($tag(div).append($tag(div,"TopLeft"),$topBorder=$tag(div,"TopCenter"),$tag(div,"TopRight")),$tag(div,false,'clear:left').append($leftBorder=$tag(div,"MiddleLeft"),$content,$rightBorder=$tag(div,"MiddleRight")),$tag(div,false,'clear:left').append($tag(div,"BottomLeft"),$bottomBorder=$tag(div,"BottomCenter"),$tag(div,"BottomRight"))).find('div div').css({'float':'left'});$loadingBay=$tag(div,false,'position:absolute; width:9999px; visibility:hidden; display:none');$groupControls=$next.add($prev).add($current).add($slideshow);$(document.body).append($overlay,$box.append($wrap,$loadingBay));}}
function addBindings(){if($box){if(!init){init=true;interfaceHeight=$topBorder.height()+$bottomBorder.height()+$content.outerHeight(true)-$content.height();interfaceWidth=$leftBorder.width()+$rightBorder.width()+$content.outerWidth(true)-$content.width();loadedHeight=$loaded.outerHeight(true);loadedWidth=$loaded.outerWidth(true);$box.css({"padding-bottom":interfaceHeight,"padding-right":interfaceWidth});$next.click(function(){publicMethod.next();});$prev.click(function(){publicMethod.prev();});$close.attr('href','#').click(function(){publicMethod.close();return false;});$overlay.click(function(){if(settings.overlayClose){publicMethod.close();}});$(document).bind('keydown.'+prefix,function(e){var key=e.keyCode;if(open&&settings.escKey&&key===27){e.preventDefault();publicMethod.close();}
if(open&&settings.arrowKey&&$related[1]){if(key===37){e.preventDefault();$prev.click();}else if(key===39){e.preventDefault();$next.click();}}});$('.'+boxElement,document).live('click',function(e){if(!(e.which>1||e.shiftKey||e.altKey||e.metaKey)){e.preventDefault();launch(this);}});}
return true;}
return false;}
if($.colorbox){return;}
$(appendHTML);publicMethod=$.fn[colorbox]=$[colorbox]=function(options,callback){var $this=this;options=options||{};appendHTML();if(addBindings()){if(!$this[0]){if($this.selector){return $this;}
$this=$('<a/>');options.open=true;}
if(callback){options.onComplete=callback;}
$this.each(function(){$.data(this,colorbox,$.extend({},$.data(this,colorbox)||defaults,options));}).addClass(boxElement);if(($.isFunction(options.open)&&options.open.call($this))||options.open){launch($this[0]);}}
return $this;};publicMethod.position=function(speed,loadedCallback){var
css,top=0,left=0,offset=$box.offset(),scrollTop,scrollLeft;$window.unbind('resize.'+prefix);$box.css({top:-9e4,left:-9e4});scrollTop=$window.scrollTop();scrollLeft=$window.scrollLeft();if(settings.fixed&&!isIE6){offset.top-=scrollTop;offset.left-=scrollLeft;$box.css({position:'fixed'});}else{top=scrollTop;left=scrollLeft;$box.css({position:'absolute'});}
if(settings.right!==false){left+=Math.max(winWidth()-settings.w-loadedWidth-interfaceWidth-setSize(settings.right,'x'),0);}else if(settings.left!==false){left+=setSize(settings.left,'x');}else{left+=Math.round(Math.max(winWidth()-settings.w-loadedWidth-interfaceWidth,0)/2);}
if(settings.bottom!==false){top+=Math.max(winHeight()-settings.h-loadedHeight-interfaceHeight-setSize(settings.bottom,'y'),0);}else if(settings.top!==false){top+=setSize(settings.top,'y');}else{top+=Math.round(Math.max(winHeight()-settings.h-loadedHeight-interfaceHeight,0)/2);}
$box.css({top:offset.top,left:offset.left});speed=($box.width()===settings.w+loadedWidth&&$box.height()===settings.h+loadedHeight)?0:speed||0;$wrap[0].style.width=$wrap[0].style.height="9999px";function modalDimensions(that){$topBorder[0].style.width=$bottomBorder[0].style.width=$content[0].style.width=that.style.width;$content[0].style.height=$leftBorder[0].style.height=$rightBorder[0].style.height=that.style.height;}
css={width:settings.w+loadedWidth,height:settings.h+loadedHeight,top:top,left:left};if(speed===0){$box.css(css);}
$box.dequeue().animate(css,{duration:speed,complete:function(){modalDimensions(this);active=false;$wrap[0].style.width=(settings.w+loadedWidth+interfaceWidth)+"px";$wrap[0].style.height=(settings.h+loadedHeight+interfaceHeight)+"px";if(settings.reposition){setTimeout(function(){$window.bind('resize.'+prefix,publicMethod.position);},1);}
if(loadedCallback){loadedCallback();}},step:function(){modalDimensions(this);}});};publicMethod.resize=function(options){if(open){options=options||{};if(options.width){settings.w=setSize(options.width,'x')-loadedWidth-interfaceWidth;}
if(options.innerWidth){settings.w=setSize(options.innerWidth,'x');}
$loaded.css({width:settings.w});if(options.height){settings.h=setSize(options.height,'y')-loadedHeight-interfaceHeight;}
if(options.innerHeight){settings.h=setSize(options.innerHeight,'y');}
if(!options.innerHeight&&!options.height){$loaded.css({height:"auto"});settings.h=$loaded.height();}
$loaded.css({height:settings.h});publicMethod.position(settings.transition==="none"?0:settings.speed);}};publicMethod.prep=function(object){if(!open){return;}
var callback,speed=settings.transition==="none"?0:settings.speed;$loaded.remove();$loaded=$tag(div,'LoadedContent').append(object);function getWidth(){settings.w=settings.w||$loaded.width();settings.w=settings.mw&&settings.mw<settings.w?settings.mw:settings.w;return settings.w;}
function getHeight(){settings.h=settings.h||$loaded.height();settings.h=settings.mh&&settings.mh<settings.h?settings.mh:settings.h;return settings.h;}
$loaded.hide().appendTo($loadingBay.show()).css({width:getWidth(),overflow:settings.scrolling?'auto':'hidden'}).css({height:getHeight()}).prependTo($content);$loadingBay.hide();$(photo).css({'float':'none'});if(isIE6){$('select').not($box.find('select')).filter(function(){return this.style.visibility!=='hidden';}).css({'visibility':'hidden'}).one(event_cleanup,function(){this.style.visibility='inherit';});}
callback=function(){var preload,i,total=$related.length,iframe,frameBorder='frameBorder',allowTransparency='allowTransparency',complete,src,img,data;if(!open){return;}
function removeFilter(){if(isIE){$box[0].style.removeAttribute('filter');}}
complete=function(){clearTimeout(loadingTimer);$loadingOverlay.detach().hide();trigger(event_complete,settings.onComplete);};if(isIE){if(photo){$loaded.fadeIn(100);}}
$title.html(settings.title).add($loaded).show();if(total>1){if(typeof settings.current==="string"){$current.html(settings.current.replace('{current}',index+1).replace('{total}',total)).show();}
$next[(settings.loop||index<total-1)?"show":"hide"]().html(settings.next);$prev[(settings.loop||index)?"show":"hide"]().html(settings.previous);if(settings.slideshow){$slideshow.show();}
if(settings.preloading){preload=[getIndex(-1),getIndex(1)];while(i=$related[preload.pop()]){data=$.data(i,colorbox);if(data&&data.href){src=data.href;if($.isFunction(src)){src=src.call(i);}}else{src=i.href;}
if(isImage(src)){img=new Image();img.src=src;}}}}else{$groupControls.hide();}
if(settings.iframe){iframe=$tag('iframe')[0];if(frameBorder in iframe){iframe[frameBorder]=0;}
if(allowTransparency in iframe){iframe[allowTransparency]="true";}
iframe.name=prefix+(+new Date());if(settings.fastIframe){complete();}else{$(iframe).one('load',complete);}
iframe.src=settings.href;if(!settings.scrolling){iframe.scrolling="no";}
$(iframe).addClass(prefix+'Iframe').appendTo($loaded).one(event_purge,function(){iframe.src="//about:blank";});}else{complete();}
if(settings.transition==='fade'){$box.fadeIn(speed,removeFilter);}else{removeFilter();}};if(settings.transition==='fade'){$box.fadeOut(speed,function(){publicMethod.position(0,callback);});}else{publicMethod.position(speed,callback);}};publicMethod.load=function(launched){var href,setResize,prep=publicMethod.prep;active=true;photo=false;element=$related[index];if(!launched){makeSettings();}
trigger(event_purge);trigger(event_load,settings.onLoad);settings.h=settings.height?setSize(settings.height,'y')-loadedHeight-interfaceHeight:settings.innerHeight&&setSize(settings.innerHeight,'y');settings.w=settings.width?setSize(settings.width,'x')-loadedWidth-interfaceWidth:settings.innerWidth&&setSize(settings.innerWidth,'x');settings.mw=settings.w;settings.mh=settings.h;if(settings.maxWidth){settings.mw=setSize(settings.maxWidth,'x')-loadedWidth-interfaceWidth;settings.mw=settings.w&&settings.w<settings.mw?settings.w:settings.mw;}
if(settings.maxHeight){settings.mh=setSize(settings.maxHeight,'y')-loadedHeight-interfaceHeight;settings.mh=settings.h&&settings.h<settings.mh?settings.h:settings.mh;}
href=settings.href;loadingTimer=setTimeout(function(){$loadingOverlay.show().appendTo($content);},100);if(settings.inline){$tag(div).hide().insertBefore($(href)[0]).one(event_purge,function(){$(this).replaceWith($loaded.children());});prep($(href));}else if(settings.iframe){prep(" ");}else if(settings.html){prep(settings.html);}else if(isImage(href)){$(photo=new Image()).addClass(prefix+'Photo').error(function(){settings.title=false;prep($tag(div,'Error').html(settings.imgError));}).load(function(){var percent;photo.onload=null;if(settings.scalePhotos){setResize=function(){photo.height-=photo.height*percent;photo.width-=photo.width*percent;};if(settings.mw&&photo.width>settings.mw){percent=(photo.width-settings.mw)/photo.width;setResize();}
if(settings.mh&&photo.height>settings.mh){percent=(photo.height-settings.mh)/photo.height;setResize();}}
if(settings.h){photo.style.marginTop=Math.max(settings.h-photo.height,0)/2+'px';}
if($related[1]&&(settings.loop||$related[index+1])){photo.style.cursor='pointer';photo.onclick=function(){publicMethod.next();};}
if(isIE){photo.style.msInterpolationMode='bicubic';}
setTimeout(function(){prep(photo);},1);});setTimeout(function(){photo.src=href;},1);}else if(href){$loadingBay.load(href,settings.data,function(data,status,xhr){prep(status==='error'?$tag(div,'Error').html(settings.xhrError):$(this).contents());});}};publicMethod.next=function(){if(!active&&$related[1]&&(settings.loop||$related[index+1])){index=getIndex(1);publicMethod.load();}};publicMethod.prev=function(){if(!active&&$related[1]&&(settings.loop||index)){index=getIndex(-1);publicMethod.load();}};publicMethod.close=function(){if(open&&!closing){closing=true;open=false;trigger(event_cleanup,settings.onCleanup);$window.unbind('.'+prefix+' .'+event_ie6);$overlay.fadeOut(200);$box.stop().fadeOut(300,function(){$box.add($overlay).css({'opacity':1,cursor:'auto'}).hide();trigger(event_purge);$loaded.remove();setTimeout(function(){closing=false;trigger(event_closed,settings.onClosed);},1);});}};publicMethod.remove=function(){$([]).add($box).add($overlay).remove();$box=null;$('.'+boxElement).removeData(colorbox).removeClass(boxElement).die();};publicMethod.element=function(){return $(element);};publicMethod.settings=defaults;}(jQuery,document,this));
;
/****** FILE: elysee/javascript/jquerypp.custom.js *****/

(function($){var getComputedStyle=document.defaultView&&document.defaultView.getComputedStyle,rupper=/([A-Z])/g,rdashAlpha=/-([a-z])/ig,fcamelCase=function(all,letter){return letter.toUpperCase();},getStyle=function(elem){if(getComputedStyle){return getComputedStyle(elem,null);}
else if(elem.currentStyle){return elem.currentStyle;}},rfloat=/float/i,rnumpx=/^-?\d+(?:px)?$/i,rnum=/^-?\d/;$.styles=function(el,styles){if(!el){return null;}
var currentS=getStyle(el),oldName,val,style=el.style,results={},i=0,left,rsLeft,camelCase,name;for(;i<styles.length;i++){name=styles[i];oldName=name.replace(rdashAlpha,fcamelCase);if(rfloat.test(name)){name=jQuery.support.cssFloat?"float":"styleFloat";oldName="cssFloat";}
if(getComputedStyle){name=name.replace(rupper,"-$1").toLowerCase();val=currentS.getPropertyValue(name);if(name==="opacity"&&val===""){val="1";}
results[oldName]=val;}else{camelCase=name.replace(rdashAlpha,fcamelCase);results[oldName]=currentS[name]||currentS[camelCase];if(!rnumpx.test(results[oldName])&&rnum.test(results[oldName])){left=style.left;rsLeft=el.runtimeStyle.left;el.runtimeStyle.left=el.currentStyle.left;style.left=camelCase==="fontSize"?"1em":(results[oldName]||0);results[oldName]=style.pixelLeft+"px";style.left=left;el.runtimeStyle.left=rsLeft;}}}
return results;};$.fn.styles=function(){return $.styles(this[0],$.makeArray(arguments));};})(jQuery);(function($){var
animationNum=0,styleSheet=null,cache=[],browser=null,oldanimate=$.fn.animate,getStyleSheet=function(){if(!styleSheet){var style=document.createElement('style');style.setAttribute("type","text/css");style.setAttribute("media","screen");document.getElementsByTagName('head')[0].appendChild(style);if(!window.createPopup){style.appendChild(document.createTextNode(''));}
styleSheet=style.sheet;}
return styleSheet;},removeAnimation=function(sheet,name){for(var j=sheet.cssRules.length-1;j>=0;j--){var rule=sheet.cssRules[j];if(rule.type===7&&rule.name==name){sheet.deleteRule(j)
return;}}},passThrough=function(props,ops){var nonElement=!(this[0]&&this[0].nodeType),isInline=!nonElement&&$(this).css("display")==="inline"&&$(this).css("float")==="none";for(var name in props){if(props[name]=='show'||props[name]=='hide'||props[name]=='toggle'||$.isArray(props[name])||props[name]<0||name=='zIndex'||name=='z-index'||name=='scrollLeft'||name=='scroll-left'||name=='scrollTop'||name=='scroll-top'){return true;}}
return props.jquery===true||getBrowser()===null||$.isEmptyObject(props)||ops.length==4||typeof ops[2]=='string'||$.isPlainObject(ops)||isInline||nonElement;},cssValue=function(origName,value){if(typeof value==="number"&&!$.cssNumber[origName]){return value+="px";}
return value;},getBrowser=function(){if(!browser){var t,el=document.createElement('fakeelement'),transitions={'transition':{transitionEnd:'transitionEnd',prefix:''},'MozTransition':{transitionEnd:'animationend',prefix:'-moz-'},'WebkitTransition':{transitionEnd:'webkitAnimationEnd',prefix:'-webkit-'}}
for(t in transitions){if(el.style[t]!==undefined){browser=transitions[t];}}}
return browser;},ffProps={top:function(el){return el.position().top;},left:function(el){return el.position().left;},width:function(el){return el.width();},height:function(el){return el.height();},fontSize:function(el){return'1em';}},addPrefix=function(properties){var result={};$.each(properties,function(name,value){result[getBrowser().prefix+name]=value;});return result;},getAnimation=function(style){var sheet,name,last;$.each(cache,function(i,animation){if(style===animation.style){name=animation.name;animation.age=0;}else{animation.age+=1;}});if(!name){sheet=getStyleSheet();name="jquerypp_animation_"+(animationNum++);sheet.insertRule("@"+getBrowser().prefix+"keyframes "+name+' '+style,(sheet.cssRules&&sheet.cssRules.length)||0);cache.push({name:name,style:style,age:0});cache.sort(function(first,second){return first.age-second.age;});if(cache.length>20){last=cache.pop();removeAnimation(sheet,last.name);}}
return name;};$.fn.animate=function(props,speed,easing,callback){if(passThrough.apply(this,arguments)){return oldanimate.apply(this,arguments);}
var optall=jQuery.speed(speed,easing,callback);this.queue(optall.queue,function(done){var
current,properties=[],to="",prop,self=$(this),duration=optall.duration,animationName,dataKey,style="{ from {",animationEnd=function(currentCSS,exec){self.css(currentCSS);self.css(addPrefix({"animation-duration":"","animation-name":"","animation-fill-mode":"","animation-play-state":""}));if(optall.old&&exec){optall.old.call(self[0],true)}
$.removeData(self,dataKey,true);}
for(prop in props){properties.push(prop);}
if(getBrowser().prefix==='-moz-'){$.each(properties,function(i,prop){var converter=ffProps[$.camelCase(prop)];if(converter&&self.css(prop)=='auto'){self.css(prop,converter(self));}});}
current=self.styles.apply(self,properties);$.each(properties,function(i,cur){var name=cur.replace(/([A-Z]|^ms)/g,"-$1").toLowerCase();style+=name+" : "+cssValue(cur,current[cur])+"; ";to+=name+" : "+cssValue(cur,props[cur])+"; ";});style+="} to {"+to+" }}";animationName=getAnimation(style);dataKey=animationName+'.run';$._data(this,dataKey,{stop:function(gotoEnd){self.css(addPrefix({'animation-play-state':'paused'}));self.off(getBrowser().transitionEnd,animationEnd);if(!gotoEnd){animationEnd(self.styles.apply(self,properties),false);}else{animationEnd(props,true);}}});self.css(addPrefix({"animation-duration":duration+"ms","animation-name":animationName,"animation-fill-mode":"forwards"}));self.one(getBrowser().transitionEnd,function(){animationEnd(props,true);done();});});return this;};})(jQuery);(function(){var event=jQuery.event,findHelper=function(events,types,callback,selector){var t,type,typeHandlers,all,h,handle,namespaces,namespace,match;for(t=0;t<types.length;t++){type=types[t];all=type.indexOf(".")<0;if(!all){namespaces=type.split(".");type=namespaces.shift();namespace=new RegExp("(^|\\.)"+namespaces.slice(0).sort().join("\\.(?:.*\\.)?")+"(\\.|$)");}
typeHandlers=(events[type]||[]).slice(0);for(h=0;h<typeHandlers.length;h++){handle=typeHandlers[h];match=(all||namespace.test(handle.namespace));if(match){if(selector){if(handle.selector===selector){callback(type,handle.origHandler||handle.handler);}}else if(selector===null){callback(type,handle.origHandler||handle.handler,handle.selector);}
else if(!handle.selector){callback(type,handle.origHandler||handle.handler);}}}}};event.find=function(el,types,selector){var events=($._data(el)||{}).events,handlers=[],t,liver,live;if(!events){return handlers;}
findHelper(events,types,function(type,handler){handlers.push(handler);},selector);return handlers;};event.findBySelector=function(el,types){var events=$._data(el).events,selectors={},add=function(selector,event,handler){var select=selectors[selector]||(selectors[selector]={}),events=select[event]||(select[event]=[]);events.push(handler);};if(!events){return selectors;}
findHelper(events,types,function(type,handler,selector){add(selector||"",type,handler);},null);return selectors;};event.supportTouch="ontouchend"in document;$.fn.respondsTo=function(events){if(!this.length){return false;}else{return event.find(this[0],$.isArray(events)?events:[events]).length>0;}};$.fn.triggerHandled=function(event,data){event=(typeof event=="string"?$.Event(event):event);this.trigger(event,data);return event.handled;};event.setupHelper=function(types,startingEvent,onFirst){if(!onFirst){onFirst=startingEvent;startingEvent=null;}
var add=function(handleObj){var bySelector,selector=handleObj.selector||"";if(selector){bySelector=event.find(this,types,selector);if(!bySelector.length){$(this).delegate(selector,startingEvent,onFirst);}}
else{if(!event.find(this,types,selector).length){event.add(this,startingEvent,onFirst,{selector:selector,delegate:this});}}},remove=function(handleObj){var bySelector,selector=handleObj.selector||"";if(selector){bySelector=event.find(this,types,selector);if(!bySelector.length){$(this).undelegate(selector,startingEvent,onFirst);}}
else{if(!event.find(this,types,selector).length){event.remove(this,startingEvent,onFirst,{selector:selector,delegate:this});}}};$.each(types,function(){event.special[this]={add:add,remove:remove,setup:function(){},teardown:function(){}};});};})(jQuery);(function($){var isPhantom=/Phantom/.test(navigator.userAgent),supportTouch=!isPhantom&&"ontouchend"in document,scrollEvent="touchmove scroll",touchStartEvent=supportTouch?"touchstart":"mousedown",touchStopEvent=supportTouch?"touchend":"mouseup",touchMoveEvent=supportTouch?"touchmove":"mousemove",data=function(event){var d=event.originalEvent.touches?event.originalEvent.touches[0]:event;return{time:(new Date).getTime(),coords:[d.pageX,d.pageY],origin:$(event.target)};};var swipe=$.event.swipe={delay:500,max:75,min:30};$.event.setupHelper(["swipe",'swipeleft','swiperight','swipeup','swipedown'],touchStartEvent,function(ev){var
start=data(ev),stop,delegate=ev.delegateTarget||ev.currentTarget,selector=ev.handleObj.selector,entered=this;function moveHandler(event){if(!start){return;}
stop=data(event);if(Math.abs(start.coords[0]-stop.coords[0])>10){event.preventDefault();}};$(document.documentElement).bind(touchMoveEvent,moveHandler).one(touchStopEvent,function(event){$(this).unbind(touchMoveEvent,moveHandler);if(start&&stop){var deltaX=Math.abs(start.coords[0]-stop.coords[0]),deltaY=Math.abs(start.coords[1]-stop.coords[1]),distance=Math.sqrt(deltaX*deltaX+deltaY*deltaY);if(stop.time-start.time<swipe.delay&&distance>=swipe.min){var events=['swipe'];if(deltaX>=swipe.min&&deltaY<swipe.min){events.push(start.coords[0]>stop.coords[0]?"swipeleft":"swiperight");}else
if(deltaY>=swipe.min&&deltaX<swipe.min){events.push(start.coords[1]<stop.coords[1]?"swipedown":"swipeup");}
$.each($.event.find(delegate,events,selector),function(){this.call(entered,ev,{start:start,end:stop})})}}
start=stop=undefined;})});})(jQuery)
;
/****** FILE: elysee/javascript/ios-orientationchange-fix.js *****/

(function(w){var ua=navigator.userAgent;if(!(/iPhone|iPad|iPod/.test(navigator.platform)&&/OS [1-5]_[0-9_]* like Mac OS X/i.test(ua)&&ua.indexOf("AppleWebKit")>-1)){return;}
var doc=w.document;if(!doc.querySelector){return;}
var meta=doc.querySelector("meta[name=viewport]"),initialContent=meta&&meta.getAttribute("content"),disabledZoom=initialContent+",maximum-scale=1,minimum-scale=1,initial-scale=1,user-scalable=no",enabledZoom=initialContent+",maximum-scale=5,minimum-scale=1,initial-scale=1,user-scalable=yes",enabled=true,x,y,z,aig;if(!meta){return;}
function restoreZoom(){meta.setAttribute("content",enabledZoom);enabled=true;}
function disableZoom(){meta.setAttribute("content",disabledZoom);enabled=false;}
function checkTilt(e){aig=e.accelerationIncludingGravity;x=Math.abs(aig.x);y=Math.abs(aig.y);z=Math.abs(aig.z);if((!w.orientation||w.orientation===180)&&(x>7||((z>6&&y<8||z<8&&y>6)&&x>5))){if(enabled){disableZoom();}}
else if(!enabled){restoreZoom();}}
w.addEventListener("orientationchange",restoreZoom,false);w.addEventListener("devicemotion",checkTilt,false);})(this);
;
