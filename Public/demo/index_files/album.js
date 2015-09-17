function Album(selector) {
    var me = this;
    this.thumbs_slider = null;
    this.photos_slider = null;

    this.refresh = function() {
        me.thumbs_slider.refresh();
        me.photos_slider.refresh();
    }
    
    this.reset = function() {
        me.thumbs_slider.reset();
        me.photos_slider.reset();
    }
    
    this._handleResize = function() {
        if(getDisplayType() == 'mobile') {
            var img = $((selector ? selector+' ' : '') + '.main .slides-container .slide img:first');
            var width = img.attr('width');
            var height = img.attr('height');
            var ratio = height/width;
            var pwidth =  $((selector ? selector+' ' : '') + '.main .slides-container').width();
            
            $((selector ? selector+' ' : '') + '.main .slides-container .slides,' + (selector ? selector+' ' : '') + '.main .slides-container .slide').css('height', parseInt(pwidth*ratio)+'px');
            $((selector ? selector+' ' : '') + '.main .slides-container .slide img').css({'width': pwidth+'px', 'height': parseInt(pwidth*ratio)+'px'});
        }
        else {
            $((selector ? selector+' ' : '') + '.main .slides-container .slide img').css({'width': '', 'height': ''});
        }
        
    }
    
    this._init = function() {

        $(window).bind('resizeWidth', function() {
            me._handleResize();
            me.refresh();
        });
        me._handleResize();        
    
        me.photos_slider = new Slider((selector ? selector+' ' : '') + '.main .slides-container', 
                                      {'showNav': false, 'maxSwipe': 1, 'debug': false,
                                       'onBeforeChange': function() {
                                           $((selector ? selector+' ' : '') + '.main .slides-container .slide').css('visibility', 'visible').attr('tabindex', '0');
                                       },
                                       'onAfterChange': function() {
                                           $((selector ? selector+' ' : '') + '.main .slides-container .slide:not(.selected-slide)').css('visibility', 'hidden').attr('tabindex', '-1');
                                           $((selector ? selector+' ' : '') + '.main .slides-container .selected-slide').focus();
                                       },
                                       'onChange': function(pos) {
                                            if(!me.thumbs_slider || me.thumbs_slider.currentIndex() == pos)
                                                return;
                                            if(me.thumbs_slider.hasNavigagtion()) {
                                                me.thumbs_slider.showItem(pos, true);
                                            }
                                            else {
                                                me.thumbs_slider.selectItem(pos);
                                            }
                                       }});

        me.thumbs_slider = new Slider((selector ? selector+' ' : '') + '.feature-gallery-slider .slides-container', 
                                      {'labelNavPrev': 'Voir les photos précédentes', 
                                       'labelNavNext':'Voir les photos suivantes', 
                                       'white': true,
                                       'onChange': function(pos) {
                                            if(!me.photos_slider || me.photos_slider.currentIndex() == pos)
                                                return;
                                            me.photos_slider.showItem(pos, true);
                                       }});

        $((selector ? selector+' ' : '') + '.feature-gallery-slider .slide a').live('click', function() {
            var item = $(this).parents('.slide:first');
            if(me.thumbs_slider.hasNavigagtion()) {
                me.thumbs_slider.showItem(item.data('pos'), true);
            }
            else {
                me.thumbs_slider.selectItem(item.data('pos'));
            }
            return false;
        });
    }

    me._init();

}
