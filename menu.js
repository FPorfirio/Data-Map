import merge from "../lodash-es/merge.js"


let dataStorage = {
    _storage: new WeakMap(),
    put: function (element, key, obj) {
        if (!this._storage.has(element)) {
            this._storage.set(element, new Map());
        }
        this._storage.get(element).set(key, obj);
    },
    get: function (element, key) {

        return this._storage.get(element) ? this._storage.get(element).get(key) : undefined
    },
    has: function (element, key) {
        return this._storage.has(element) && this._storage.get(element).has(key);
    },
    remove: function (element, key) {
        var ret = this._storage.get(element).delete(key);
        if (!this._storage.get(element).size === 0) {
            this._storage.delete(element);
        }
        return ret;
    }
}

const DLMenu = function( options, element ) {
    this.el = element;
    this._init( options );
};

// the options
DLMenu.defaults = {
    // classes for the animation effects
    animationClasses : { classin : 'dl-animate-in-1', classout : 'dl-animate-out-1' },
    // callback: click a link that has a sub menu
    // el is the link element (li); name is the level name
    onLevelClick : function( el, name ) { return false; },
    // callback: click a link that does not have a sub menu
    // el is the link element (li); ev is the event obj
    onLinkClick : function( el, ev ) { return false; }
};

DLMenu.prototype = {
    _init : function( options ) {

        // options
        this.options = merge({}, DLMenu.defaults, options);
        // cache some elements and initialize some variables
        this._config();
        
        var animEndEventNames = {
                'WebkitAnimation' : 'webkitAnimationEnd',
                'OAnimation' : 'oAnimationEnd',
                'msAnimation' : 'MSAnimationEnd',
                'animation' : 'animationend'
            },
            transEndEventNames = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition' : 'transitionend',
                'OTransition' : 'oTransitionEnd',
                'msTransition' : 'MSTransitionEnd',
                'transition' : 'transitionend'
            };
        // animation end event name
        this.animEndEventName = animEndEventNames['WebkitAnimation'];
        // transition end event name
        this.transEndEventName = transEndEventNames['WebkitTransition'];
        // support for css animations and css transitions
        this.supportAnimations = true;
        this.supportTransitions = true;

        this._initEvents();

    },
    _config : function() {
        this.open = false;
        this.trigger = this.el.firstChild
        this.menu = this.el.getElementsByClassName( 'dl-menu' )[0];
        [...this.el.getElementsByClassName( 'dl-submenu' )]
        .forEach((e) => {
            e.insertAdjacentHTML('afterbegin', '<li class="dl-back"><button>back</button></li>')
        })
        this.back = this.el.getElementsByClassName('li.dl-back');
    },
    _initEvents : function() {

        var self = this;

        this.trigger.addEventListener( 'click', function() {
            
            if( self.open ) {
                self._closeMenu();
            } 
            else {
                self._openMenu();
            }
            return false;

        } );
        
        self.menu.addEventListener('click', function(event){
            event.stopPropagation();
            let item = event.target
            console.log(item)
            if (!item.parentElement.classList.contains('dl-back')){
                if(item.parentElement.nextElementSibling.tagName != 'DIV'){
                    let submenu = item.parentElement.nextElementSibling.firstChild;
                    let subMenuClone = submenu.cloneNode(true);
                    subMenuClone.style.opacity = 0;
                    self.menu.insertAdjacentElement('afterend', subMenuClone);
                    
                    function onAnimationEndFn(){
                        self.menu.removeEventListener(self.animEndEventName, onAnimationEndFn);
                        self.menu.classList.remove(self.options.animationClasses.classout);
                        self.menu.classList.add('dl-subview');
                        item.parentElement.nextElementSibling.classList.add('dl-subviewopen');
                        let itemSubView = item.closest('.dl-subviewopen');
                        if(itemSubView){
                            itemSubView.classList.remove('dl-subviewopen');
                            itemSubView.classList.add('dl-subview')
                        }
                        subMenuClone.remove();   
                    }
                    
                    setTimeout(() => {
                        subMenuClone.classList.add(self.options.animationClasses.classin);
                        self.menu.classList.add(self.options.animationClasses.classout);
                        if(self.supportAnimations){
                            self.menu.addEventListener(self.animEndEventName, onAnimationEndFn)
                        }
                        else{
                            onAnimationEndFn.call();
                        }
                        self.options.onLevelClick(item, "submenu.querySelector('li button').textContent")
                    });

                }
                else{
                }
            }
            else{
                let submenu = item.closest('ul.dl-submenu');
                console.log(submenu)
                let subMenuParent = submenu.parentElement;
                let subMenuClone = submenu.cloneNode(true);
                console.log(subMenuClone)
                self.menu.insertAdjacentElement('afterend', subMenuClone);

                function onAnimationEndFn(){
                    self.menu.removeEventListener(self.animEndEventName, onAnimationEndFn);
                    self.menu.classList.remove(self.options.animationClasses.classin);
                    subMenuClone.remove()
                }
                setTimeout(() => {
                    subMenuClone.classList.add(self.options.animationClasses.classout);
                    self.menu.classList.add(self.options.animationClasses.classin);

                    if(self.supportAnimations){
                        self.menu.addEventListener(self.animEndEventName,onAnimationEndFn);
                    }
                    else{
                        onAnimationEndFn.call();
                    }

                    subMenuParent.classList.remove('dl-subviewopen');

                    let subview = event.target.closest('.dl-subview');
                    if(subview.tagName == 'LI'){
                        subview.classList.add('dl-subviewopen');
                    }

                    subview.classList.remove('dl-subview');

                });
                return false;
            }
        })   
    },

    _closeMenu: function(){
        let self = this;
        let onTransitionEndFn = function(){
            self.menu.removeEventListener(self.transEndEventName, onTransitionEndFn);
            self._resetMenu();
        }

        self.menu.classList.remove('dl-menuopen');
        self.menu.classList.add('dl-menu-toggle');
        self.trigger.classList.remove('dl-active');

        if(this.supportTransitions){
            self.menu.addEventListener(self.transEndEventName, onTransitionEndFn);
        }
        else{
            onTransitionEndFn.call();
        }
        
        self.open = false;
    },

    _openMenu : function(){
        let self = this;
        /*let body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', function(){
            self._closeMenu();
        })*/

        self.menu.classList.add('dl-menuopen', 'dl-menu-toggle');
        self.menu.addEventListener(this.transEndEventName, function(){
            self.menu.classList.remove('dl-menu-toggle');
        });
        self.trigger.classList.add('dl-active');
        self.open = true;

    },
    
    // resets the menu to its original state (first level of options)
    _resetMenu : function() {

        let self = this;
        self.menu.classList.remove( 'dl-subview' );
       
        [...self.menu.querySelectorAll('.dl-subview'),...self.menu.querySelectorAll('.dl-subviewopen')]
        .forEach((item) => {
            if(item.classList.contains('dl-subview')){
                item.classList.remove('dl-subview')
            }
            else if(item.classList.contains('dl-subviewopen')){
                item.classList.remove('dl-subviewopen')
            }
        })
    }
};

var logError = function( message ) {
    if ( window.console ) {
        window.console.error( message );
    }
};

function dlmenu(selector, options ) {
        
            var instance = dataStorage.get( selector, 'dlmenu' );
            if ( instance ) {
                instance._init();
            }
            else {
                instance = dataStorage.put( selector, 'dlmenu', new DLMenu( options, selector ) );
            }
      
};

export default dlmenu;