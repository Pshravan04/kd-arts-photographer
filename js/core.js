/** 
 * Author: Shadow Themes
 * Author URL: http://shadow-themes.com
 */
"use strict";

var kdarts = {},
    $kdarts_html = jQuery('html'),
	kdarts_tns = [],
    $kdarts_body = jQuery('body'),
    $kdarts_window = jQuery(window),
    $kdarts_header = jQuery('header#kdarts-header'),
    $kdarts_footer = jQuery('footer#kdarts-footer'),
	$kdarts_main = jQuery('main.kdarts-content-wrap'),
	$kdarts_scroll = jQuery('.kdarts-content-scroll'),
	$kdarts_header_holder;

// Default Options
kdarts.config = {
    'smooth_ease' : 0.1,
	'content_load_delay': 0.8
}

class kdarts_Before_After {
	constructor($obj) {
		if ($obj instanceof jQuery) {
			let this_class = this;
			this.$el = {
				$wrap: $obj,
				$before : jQuery('<div class="kdarts-before-after-img kdarts-before-img"/>').appendTo($obj),
				$after : jQuery('<div class="kdarts-before-after-img kdarts-after-img"/>').appendTo($obj),
				$divider : jQuery('<div class="kdarts-before-after-divider"><i class="la la-arrows-h"></i></div>').appendTo($obj),
			};
			this.offset = this.$el.$wrap.offset().left;
			this.size = this.$el.$wrap.width();
			this.current = 50;
			this.target = 50;
			this.isDown = false;
			
			this.$el.$before.css('background-image', 'url('+ this.$el.$wrap.data('img-before') +')');
			this.$el.$after.css('background-image', 'url('+ this.$el.$wrap.data('img-after') +')');
			
			// Mouse Events
			this.$el.$wrap.on('mousedown', function(e) {
				e.preventDefault();
				this_class.isDown = true;
			}).on('mousemove', function(e) {
				e.preventDefault();
				if (this_class.isDown) {
					let position = e.pageX - this_class.offset,
						newTarget = position/this_class.size;
					if (newTarget > 1)
						newTarget = 1;
					if (newTarget < 0)
						newTarget = 0;
					this_class.target = newTarget * 100;
				}
			}).on('mouseleave', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			}).on('mouseup', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			});
			
			// Touch Events
			this.$el.$wrap[0].addEventListener('touchstart', function(e) {
				e.preventDefault();
				this_class.isDown = true;
			}, false);
			this.$el.$wrap[0].addEventListener('touchmove', function(e) {
				e.preventDefault();
				if (this_class.isDown) {
					let position = e.touches[0].clientX - this_class.offset,
						newTarget = position/this_class.size;
					if (newTarget > 1)
						newTarget = 1;
					if (newTarget < 0)
						newTarget = 0;
					this_class.target = newTarget * 100;
				}				
			}, false);
			this.$el.$wrap[0].addEventListener('touchend', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			}, false);
			
			// Window Events
			$kdarts_window.on('resize', function() {
				this_class.layout();
				this_class.reset();
			}).on('load', function() {
				this_class.layout();
			});

			// Layout
			this.layout();

			// Run Animation
			this.requestAnimation();
		} else {
			return false;
		}
	}
	
	layout() {
		this.offset = this.$el.$wrap.offset().left;
		this.size = this.$el.$wrap.width();
	}
	reset() {
		this.current = 50;
		this.target = 50;
	}
	requestAnimation() {
		this.animation = requestAnimationFrame(() => this.animate());
	}
	animate() {
		this.current += ((this.target - this.current) * 0.1);
		this.$el.$after.css('width', parseFloat(this.current).toFixed(1) +'%');
		this.$el.$divider.css('left', parseFloat(this.current).toFixed(1) +'%');
		this.requestAnimation();
	}
}

// Magic Cursor
kdarts.cursor = {
	$el : jQuery('.kdarts-cursor'),
	$el_main : jQuery('span.kdarts-cursor-circle'),
	targetX: $kdarts_window.width()/2,
	targetY: $kdarts_window.height()/2,
	currentX: $kdarts_window.width()/2,
	currentY: $kdarts_window.height()/2,
	easing: 0.2,
	init : function() {
		let $this_el = this.$el;
		// Cursor Move
		$kdarts_window.on('mousemove', function(e) {
			kdarts.cursor.targetX = e.clientX - $this_el.width()/2;
			kdarts.cursor.targetY = e.clientY - $this_el.height()/2;
        });
		if ($this_el.length) {
			kdarts.cursor.animate();
		}
		
		// Show and Hide Cursor
        $kdarts_window.on('mouseleave', function() {
			kdarts.cursor.$el.addClass('is-inactive');
        }).on('mouseenter', function() {
			kdarts.cursor.$el.removeClass('is-inactive');
        });
		
		// Bind Interractions
		jQuery(document).on('mouseenter', 'a', function() {
			if (jQuery(this).hasClass('kdarts-lightbox-link')) {
				kdarts.cursor.$el.addClass('int-lightbox');
			} else {
				kdarts.cursor.$el.addClass('int-link');
			}
			jQuery(this).on('mouseleave', function() {
				kdarts.cursor.$el.removeClass('int-link int-lightbox');
			});			
		}).on('mouseenter', 'button', function() {
			kdarts.cursor.$el.addClass('int-link');
			jQuery(this).on('mouseleave', function() {
				kdarts.cursor.$el.removeClass('int-link');
			});
		}).on('mouseenter', 'input[type="submit"]', function() {
			kdarts.cursor.$el.addClass('int-link');
			jQuery(this).on('mouseleave', function() {
				kdarts.cursor.$el.removeClass('int-link');
			});
		}).on('mouseenter', '.kdarts-back', function() {
			jQuery('.kdarts-back').on('mouseenter', function() {
				kdarts.cursor.$el.addClass('int-link');
				jQuery(this).on('mouseleave', function() {
					kdarts.cursor.$el.removeClass('int-link');
				});
			});
		}).on('mouseenter', '.is-link', function() {
			jQuery('.is-link').on('mouseenter', function() {
				kdarts.cursor.$el.addClass('int-link');
				jQuery(this).on('mouseleave', function() {
					kdarts.cursor.$el.removeClass('int-link');
				});
			});
		}).on('mouseenter', '.kdarts-aside-overlay', function() {
			kdarts.cursor.$el.addClass('int-close');
			jQuery(this).on('mouseleave', function() {
				kdarts.cursor.$el.removeClass('int-close');
			});
		}).on('mouseenter', '.kdarts-before-after', function() {
			kdarts.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				kdarts.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.kdarts-testimonials-carousel .tns-ovh', function() {
			kdarts.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				kdarts.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.kdarts-albums-slider', function() {
			kdarts.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				kdarts.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.pswp__scroll-wrap', function() {
			kdarts.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				kdarts.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.kdarts-albums-carousel', function() {
			if (jQuery(this).hasClass('is-vertical')) {
				kdarts.cursor.$el.addClass('int-grab-v');
			} else {
				kdarts.cursor.$el.addClass('int-grab-h');
			}
			jQuery(this).on('mouseleave', function() {
				kdarts.cursor.$el.removeClass('int-grab-h int-grab-v');
			});
		});
	},
	animate: function() {
		let $this_el = kdarts.cursor.$el;
		kdarts.cursor.currentX += ((kdarts.cursor.targetX - kdarts.cursor.currentX) * kdarts.cursor.easing);
		kdarts.cursor.currentY += ((kdarts.cursor.targetY - kdarts.cursor.currentY) * kdarts.cursor.easing);
		$this_el.css('transform', 'translate3d('+ kdarts.cursor.currentX +'px, '+ kdarts.cursor.currentY +'px, 0)');
		requestAnimationFrame( kdarts.cursor.animate );
	}
};
kdarts.cursor.init();

// Lightbox
if ( jQuery('.kdarts-lightbox-link').length ) {
	kdarts.pswp = {
		gallery : Array(),
		html : jQuery('\
		<!-- Root element of PhotoSwipe. Must have class pswp. -->\
		<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">\
			<div class="pswp__bg"></div><!-- PSWP Background -->\
			\
			<div class="pswp__scroll-wrap">\
				<div class="pswp__container">\
					<div class="pswp__item"></div>\
					<div class="pswp__item"></div>\
					<div class="pswp__item"></div>\
				</div><!-- .pswp__container -->\
				\
				<div class="pswp__ui pswp__ui--hidden">\
					<div class="pswp__top-bar">\
						<!--  Controls are self-explanatory. Order can be changed. -->\
						<div class="pswp__counter"></div>\
						\
						<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>\
						\
						<div class="pswp__preloader">\
							<div class="pswp__preloader__icn">\
							  <div class="pswp__preloader__cut">\
								<div class="pswp__preloader__donut"></div>\
							  </div><!-- .pswp__preloader__cut -->\
							</div><!-- .pswp__preloader__icn -->\
						</div><!-- .pswp__preloader -->\
					</div><!-- .pswp__top-bar -->\
					\
					<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\
						<div class="pswp__share-tooltip"></div>\
					</div><!-- .pswp__share-modal -->\
					\
					<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>\
					<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>\
					\
					<div class="pswp__caption">\
						<div class="pswp__caption__center"></div>\
					</div><!-- .pswp__caption -->\
				</div><!-- .pswp__ui pswp__ui--hidden -->\
			</div><!-- .pswp__scroll-wrap -->\
		</div><!-- .pswp -->').appendTo($kdarts_body)
	};
}

// kdarts Kenburns
if (jQuery('.kdarts-kenburns-slider').length) {
	kdarts.kenburns = {
		init: function() {
			// Set Variables
			let this_f = this;
			this_f.$el = jQuery('.kdarts-kenburns-slider');
			this_f.items = this_f.$el.find('.kdarts-kenburns-slide').length;
			this_f.transition = parseInt(this_f.$el.data('transition'),10);
			this_f.delay = parseInt(this_f.$el.data('delay'), 10)/1000 + this_f.transition*0.001;
			this_f.zoom = this_f.$el.data('zoom');
			this_f.from = this_f.zoom;
			this_f.to = 1;
			this_f.active = 0;

			// Setup Items
			let prev_offset_x = 0,
				prev_offset_y = 0;

			this_f.$el.find('.kdarts-kenburns-slide').each(function() {
				let offset_x = Math.random() * 100,
					offset_y = Math.random() * 100;

				if (prev_offset_x > 50 && offset_x > 50) {
					offset_x = offset_x - 50;
				} else if (prev_offset_x < 50 && offset_x < 50) {
					offset_x = offset_x + 50;
				}
				if (prev_offset_y > 50 && offset_y > 50) {
					offset_y = offset_y - 50;
				} else if (prev_offset_y < 50 && offset_y < 50) {
					offset_y = offset_y + 50;
				}

				prev_offset_x = offset_x;
				prev_offset_y = offset_y;				

				jQuery(this).css({
					'transition' : 'opacity ' + this_f.transition + 'ms',
					'transform-origin' : offset_x + '% ' + offset_y + '%',
					'background-image' : 'url('+ jQuery(this).data('src')+')'
				});
			});

			// Run Slider
			kdarts.kenburns.change();
		},
		change: function() {
			let this_f = this,
				scale_from = this_f.from,
				scale_to = this_f.to;

			// Loop
			if (this_f.active >= this_f.items) {
				this_f.active = 0;
			}
			let current_slide = this_f.$el.find('.kdarts-kenburns-slide').eq(this_f.active);

			gsap.fromTo(current_slide, {
				scale: scale_from,
				onStart: function() {
					current_slide.addClass('is-active');
				}
			},
			{
				scale: scale_to,
				duration: this_f.delay,
				ease: 'none',
				onComplete: function() {
					kdarts.kenburns.active++;
					kdarts.kenburns.from = scale_to;
					kdarts.kenburns.to = scale_from;
					kdarts.kenburns.change();
					kdarts.kenburns.$el.find('.is-active').removeClass('is-active');
				}
			});
		}
	};	
}

// Counter
kdarts.counter = function( this_el ) {
	jQuery(this_el).prop('Counter', 0).animate({
		Counter: jQuery(this_el).text()
	}, {
		duration: parseInt(jQuery(this_el).parent().data('delay'), 10),
		easing: 'swing',
		step: function (now) {
			jQuery(this_el).text(Math.ceil(now));
		}
	});
}

// Circle Progress Bar
kdarts.progress = {
	init: function(this_el) {
		let $this = jQuery(this_el),
			$bar_wrap = jQuery('<div class="kdarts-progress-item-wrap"/>')
						.prependTo($this),
			this_size = this.getSize(this_el),
			$bar_svg = jQuery('\
				<svg width="'+ this_size.svgSize +'" height="'+ this_size.svgSize +'" viewPort="0 0 '+ this_size.barSize +' '+ this_size.barSize +'" version="1.1" xmlns="http://www.w3.org/2000/svg">\
					<circle class="kdarts-progress-circle--bg" r="'+ this_size.r +'" cx="'+ this_size.barSize +'" cy="'+ this_size.barSize +'" fill="transparent" stroke-dasharray="'+ this_size.dashArray +'" stroke-dashoffset="0"></circle>\
					<circle class="kdarts-progress-circle--bar" transform="rotate(-90, '+ this_size.barSize +', '+ this_size.barSize +')" r="'+ this_size.r +'" cx="'+ this_size.barSize +'" cy="'+ this_size.barSize +'" fill="transparent" stroke-dasharray="'+ this_size.dashArray +'" stroke-dashoffset="'+ this_size.dashArray +'"></circle>\
				</svg>').appendTo($bar_wrap);
			$bar_svg.find('.kdarts-progress-circle--bar').css('transition', 'stroke-dashoffset ' + $this.data('delay')+'ms ease-in-out');
			$bar_wrap.append('<span class="kdarts-progress-counter">' + $this.data('percent') + '</span>');
		
		$kdarts_window.on('resize', this.layout(this_el));
	},
	layout: function(this_el) {
		let $this = jQuery(this_el);
		if ($this.find('svg').length) {
			let this_size = this.getSize(this_el),
				$svg = $this.find('svg'),
				$barBg = $this.find('.kdarts-progress-circle--bg'),
				$bar = $this.find('.kdarts-progress-circle--bar');
			$svg.attr('width', this_size.svgSize)
				.attr('height', this_size.svgSize)
				.attr('viewPort', '0 0 '+ this_size.barSize +' '+ this_size.barSize);
			$barBg.css({
				'r' : this_size.r,
				'cx' : this_size.barSize,
				'cy' : this_size.barSize,
				'stroke-dasharray': this_size.dashArray,
			});
			$bar.css({
				'r' : this_size.r,
				'cx' : this_size.barSize,
				'cy' : this_size.barSize,
				'stroke-dasharray': this_size.dashArray,
			}).attr('transform', 'rotate(-90, '+ this_size.barSize +', '+ this_size.barSize +')');
			if ($this.hasClass('is-done')) {
				
			} else {
				$bar.css('stroke-dashoffset', this_size.dashArray);
			}
		}
	},
	getSize: function(this_el) {
		let $this = jQuery(this_el),
			$wrap = $this.find('.kdarts-progress-item-wrap'),
			sizes = {
				percent: parseInt($this.data('percent'), 10),
				svgSize: $wrap.width(),
				stroke: parseInt($wrap.css('stroke-width'), 10),
			}
			sizes.barSize = Math.floor(sizes.svgSize/2);
			sizes.r = sizes.barSize - sizes.stroke;
			sizes.dashArray = parseFloat(Math.PI*(sizes.r*2)).toFixed(2);
			sizes.dashOffset = parseFloat(sizes.dashArray - (sizes.dashArray*sizes.percent)/100).toFixed(2);

		return sizes;
	},
	animate: function(this_el) {
		let $this = jQuery(this_el),
			$this_counter = $this.find('span.kdarts-progress-counter'),
			this_size = this.getSize(this_el),
			$bar = $this.find('.kdarts-progress-circle--bar');
		$bar.css('stroke-dashoffset', this_size.dashOffset);
		$this_counter.prop('Counter', 0).animate({
			Counter: $this_counter.text()
		}, {
			duration: parseInt($this_counter.parents('.kdarts-progress-item').data('delay'), 10),
			easing: 'swing',
			step: function (now) {
				$this_counter.text(Math.ceil(now)+'%');
			}
		});

	}
}
if ('IntersectionObserver' in window) {
	kdarts.progress.observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!jQuery(entry.target).hasClass('is-done')) {
				if(entry.isIntersecting) {
					jQuery(entry.target).addClass('is-done');
					kdarts.progress.animate(jQuery(entry.target)[0]);
				}
			}
		});
	});
}

// Coming Soon Count Down
kdarts.count_down = {
	init : function() {
		let $dom = jQuery('#kdarts-coming-soon'),
			datetime = new Date( $dom.find('time').text() + 'T00:00:00'),
			is_this;

		$dom.find('time').remove();
		this.labels = $dom.data('labels');
		this.days = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ kdarts.count_down.labels[0] +'</span>');
		this.hours = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ kdarts.count_down.labels[1] +'</span>');
		this.minutes = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ kdarts.count_down.labels[2] +'</span>');
		this.seconds = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ kdarts.count_down.labels[3] +'</span>');

		this.update( datetime );

		if ( this.interval ) {
			clearInterval( this.interval );
		}

		this.interval = setInterval( function() {
			kdarts.count_down.update( datetime );
		}, 1000);
	},
	update : function( endDate ) {
		let now = new Date();
		let difference = endDate.getTime() - now.getTime();

		if (difference <= 0) {
			clearInterval( this.interval );
		} else {
			let seconds = Math.floor(difference / 1000);
			let minutes = Math.floor(seconds / 60);
			let hours = Math.floor(minutes / 60);
			let days = Math.floor(hours / 24);

			hours %= 24;
			minutes %= 60;
			seconds %= 60;

			if (days < 10) {
				days = ("0" + days).slice(-2);
			}

			this.days.text(days);
			this.hours.text(("0" + hours).slice(-2));
			this.minutes.text(("0" + minutes).slice(-2));
			this.seconds.text(("0" + seconds).slice(-2));
		}
	}	
};

// Smooth Scroll
kdarts.old_scroll_top = 0;
kdarts.sScroll = {
	target: 0,
	current: 0,
	animate: function() {
		kdarts.sScroll.current += ((kdarts.sScroll.target - kdarts.sScroll.current) * kdarts.config.smooth_ease);
		$kdarts_scroll.css('transform', 'translate3d(0, -'+ kdarts.sScroll.current +'px, 0)');
		requestAnimationFrame( kdarts.sScroll.animate );
	},
	layout: function() {
		if ($kdarts_scroll.length) {
			let this_content = $kdarts_scroll.children('.kdarts-content');
			this_content.css('min-height', '0px');
			
			// Set Body Height (for smooth scroll)
			if ($kdarts_scroll.height() <= $kdarts_window.height()) {
				let min_height = $kdarts_window.height() - $kdarts_footer.height();

				if (!$kdarts_body.hasClass('no-header-padding'))
					min_height = min_height - $kdarts_scroll.children('.kdarts-header-holder').height();

				this_content.css('min-height', min_height+'px');				
				$kdarts_scroll.addClass('is-centered');
			} else {
				$kdarts_scroll.removeClass('is-centered');
			}

			if ($kdarts_body.hasClass('kdarts-smooth-scroll')) {
				$kdarts_body.height($kdarts_scroll.height());
			}
		}
	}
};
if ($kdarts_scroll.length || $kdarts_body.hasClass('kdarts-home-template')) {
	kdarts.sScroll.animate();
}

kdarts.init = function() {
	$kdarts_body.addClass('is-init');
	kdarts.old_scroll_top = $kdarts_window.scrollTop();
	
	// Header Holder
	$kdarts_header_holder = jQuery('<div class="kdarts-header-holder"></div>');
	$kdarts_header_holder.height($kdarts_header.height()).prependTo($kdarts_scroll);
	
	// Set Logo Size
	if (jQuery('a.kdarts-logo').length) {
		jQuery('a.kdarts-logo').each(function() {
			let $this = jQuery(this),
				$img = $this.children('img'),
				w = $img.attr('width'),
				h = $img.attr('height');
			if ($this.hasClass('is-retina')) {
				$this.width(w/2).height(h/2);
			} else {
				$this.width(w).height(h);
			}
		});
	}
	
	// Set Menu Active Parent Items
	if (jQuery('.current-menu-item').length) {
		jQuery('.current-menu-item').each(function() {
			jQuery(this).parents('li').addClass('current-menu-ancestor');
		});
	}
	
	// Mobile DOM Construct
	if (jQuery('.kdarts-page-title-wrap').length) {
		if (jQuery('.kdarts-content-wrap .kdarts-content').length) {
			let kdarts_mobile_title = jQuery('<div class="kdarts-mobile-title-wrap">' + jQuery('.kdarts-page-title-wrap').html() + '</div>');
			jQuery('.kdarts-content-wrap .kdarts-content').prepend(kdarts_mobile_title);
		}
	}
	let kdarts_mobile_header = jQuery('<div class="kdarts-mobile-header">'),
		mobile_menu_button = jQuery('<a href="#" class="kdarts-mobile-menu-button"><i class="la la-bars"></i></a>').appendTo(kdarts_mobile_header),
		mobile_menu = jQuery('<nav class="kdarts-mobile-menu"></nav>').appendTo($kdarts_body),
		mobile_menu_close = jQuery('<a href="#" class="kdarts-mobile-menu-close"></a>').appendTo(mobile_menu);
	
	if (jQuery('.kdarts-aside-overlay').length) {
		kdarts_mobile_header.append('\
			<a class="kdarts-aside-toggler" href="#">\
				<span class="kdarts-aside-toggler__icon01"></span>\
				<span class="kdarts-aside-toggler__icon02"></span>\
				<span class="kdarts-aside-toggler__icon03"></span>\
			</a>');
	}
	
	// Mobile Meintenance Email
	if ($kdarts_body.hasClass('kdarts-maintenance-wrap')) {
		kdarts_mobile_header.prepend('<a class="kdarts-contacts-toggler" href="#"><i class="la la-envelope"></i></a>');		
		jQuery(document).on('click', '.kdarts-contacts-toggler', function() {
			$kdarts_body.addClass('contacts-shown');
		});
		jQuery(document).on('click', '.kdarts-contacts-close', function() {
			$kdarts_body.removeClass('contacts-shown');
		});
	}

	$kdarts_header.find('.kdarts-nav-block').append(kdarts_mobile_header);
	
	if ($kdarts_header.find('.kdarts-nav').length) {
		mobile_menu.append('\
			<div class="kdarts-mobile-menu-inner">\
				<div class="kdarts-mobile-menu-content">\
					'+ $kdarts_header.find('.kdarts-nav').html() +'\
				</div>\
			</div>\
		');
		mobile_menu.find('ul.main-menu a').on('click', function(e) {
			var $this = jQuery(this),
				$parent = $this.parent();
			if ($parent.hasClass('.menu-item-has-children') || $parent.find('ul').length) {
				e.preventDefault();
				$parent.children('ul').slideToggle(300).toggleClass('is-open');
			}
		});
		mobile_menu.find('ul.sub-menu').slideUp(1);
	}
	
	mobile_menu_button.on('click', function() {
		$kdarts_body.addClass('kdarts-mobile-menu-shown').addClass('is-locked');
		kdarts.old_scroll_top = $kdarts_window.scrollTop();
		gsap.fromTo('.kdarts-mobile-menu ul.main-menu > li', 
			{
				x: 0,
				y: 40,
				opacity: 0,
			},
			{
				x: 0,
				y: 0,
				opacity: 1,
				duration: 0.2,
				delay: 0.3,
				stagger: 0.1,
				onComplete: function() {
					$kdarts_body.removeClass('is-locked');
				}
			},
		);
	});
	
	mobile_menu_close.on('click', function() {
		let setDelay = 0;
		$kdarts_body.addClass('is-locked');
		if (mobile_menu.find('.is-open').length) {
			mobile_menu.find('ul.sub-menu').slideUp(300);
			setDelay = 0.3;
		}
		gsap.fromTo('.kdarts-mobile-menu ul.main-menu > li', 
			{
				x: 0,
				y: 0,
				opacity: 1
			},
			{
				x: 0,
				y: -40,
				opacity: 0,
				duration: 0.2,
				delay: setDelay,
				stagger: 0.1,
				onComplete: function() {
					$kdarts_body.removeClass('kdarts-mobile-menu-shown').removeClass('is-locked');
				}
			},
		);
	});
	
	jQuery('.kdarts-menu-overlay').on('click', function() {
		$kdarts_body.removeClass('kdarts-mobile-menu-shown').removeClass('is-locked');
	});
	
	// Aside Open and Close
	jQuery(document).on('click', 'a.kdarts-aside-toggler', function(e) {
		e.preventDefault();
		$kdarts_body.addClass('kdarts-aside-shown').removeClass('kdarts-menu-fade');
		kdarts.old_scroll_top = $kdarts_window.scrollTop();
	});
	jQuery('a.kdarts-aside-close').on('click', function(e) {
		e.preventDefault();
		$kdarts_body.removeClass('kdarts-aside-shown');
	});
	jQuery('.kdarts-aside-overlay').on('click', function() {
		$kdarts_body.removeClass('kdarts-aside-shown');
	});

    // Main Nav Events
    jQuery('nav.kdarts-nav a').on( 'mouseenter', function() {
        $kdarts_body.addClass('kdarts-menu-fade');
    });
    jQuery('nav.kdarts-nav').on( 'mouseleave', function() {
        $kdarts_body.removeClass('kdarts-menu-fade');
    });

	// Back Button Functions 
	jQuery('.kdarts-back').on('click', function(e) {
		e.preventDefault();
		var $this = jQuery(this);
		
		// Back to Top
		if ($this.hasClass('is-to-top')) {
			if ($kdarts_window.scrollTop() > $kdarts_window.height()/2) {
				$kdarts_body.addClass('has-to-top');
			}
			$this.addClass('in-action');
			
			jQuery('html, body').stop().animate({scrollTop: 0}, 500, function() {
				$kdarts_body.removeClass('has-to-top');
				$this.removeClass('in-action');
			});
		}
		
		// Maintenace Mode - Write Message
		if ($this.hasClass('is-message')) {
			$kdarts_body.addClass('is-locked in-message-mode');
			$this.parent().removeClass('is-loaded');
			gsap.to('.kdarts-content-wrap .kdarts-content', {
				opacity: 0,
				y: -150,
				duration: 0.7,
				onComplete: function() {
					jQuery('.kdarts-back-wrap .is-message').hide();
					jQuery('.kdarts-back-wrap .is-message-close').show();
				}
			});
			gsap.to('.kdarts-page-background', {
				opacity: 0,
				scale: 1.05,
				duration: 1,
			});
			gsap.to('#kdarts-contacts-wrap', {
				opacity: 1,
				y: 0,
				duration: 0.7,
				delay: 0.3,
				onComplete: function() {
					$kdarts_body.removeClass('is-locked');
					jQuery('.kdarts-back-wrap').addClass('is-loaded');
				}
			});
		}
		
		// Maintenace Mode - Close Message
		if ($this.hasClass('is-message-close')) {
			$kdarts_body.addClass('is-locked').removeClass('in-message-mode');
			$this.parent().removeClass('is-loaded');
			gsap.to('#kdarts-contacts-wrap', {
				opacity: 0,
				y: 150,
				duration: 0.7,
				onComplete: function() {
					jQuery('.kdarts-back-wrap .is-message').show();
					jQuery('.kdarts-back-wrap .is-message-close').hide();
				}
			});
			gsap.to('.kdarts-page-background', {
				opacity: 0.13,
				scale: 1,
				duration: 1,
			});
			gsap.to('.kdarts-content-wrap .kdarts-content', {
				opacity: 1,
				y: 0,
				duration: 1,
				delay: 0.3,
				onComplete: function() {
					$kdarts_body.removeClass('is-locked');
					jQuery('.kdarts-back-wrap').addClass('is-loaded');
				}
			});
		}
		
		// Home Return
		if ($this.hasClass('is-home-return')) {
			$kdarts_body.addClass('is-locked');
			gsap.fromTo('.kdarts-content', 1, {
				y: 0,
				opacity: 1,
			},
			{
				y: -100,
				opacity: 0,
				duration: 1,
				onComplete: function() {
					if ($kdarts_scroll.find('#kdarts-home-works').length) {
						var $current_content = jQuery('#kdarts-home-works');
					}
					if ($kdarts_scroll.find('#kdarts-home-contacts').length) {
						var $current_content = jQuery('#kdarts-home-contacts');
					}
					for (var i = 0; i < 4; i++) {
						$current_content.unwrap();
					}
					kdarts.sScroll.layout();
					$kdarts_body.height($kdarts_window.height());
				}
			});
			
			if (jQuery('.kdarts-page-title-wrap').length) {
				jQuery('.kdarts-page-title-wrap').removeClass('is-loaded').addClass('is-inactive');			
				gsap.to('.kdarts-page-title-wrap', 0.5, {
					css: {
						top: 0,
					},
					delay: 0.5,
				});
			}
			if (jQuery('.kdarts-back-wrap').length) {
				jQuery('.kdarts-back-wrap').removeClass('is-loaded').addClass('is-inactive');
				gsap.to('.kdarts-back-wrap', 0.5, {
					css: {
						top: '200%',
					},
					delay: 0.5,
				});				
			}
			gsap.to('.kdarts-home-link--works', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.kdarts-home-link--works').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.kdarts-home-link--contacts', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.kdarts-home-link--contacts').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.kdarts-page-background', {
				opacity: 0.75,
				scale: 1,
				duration: 1,
				delay: 1,
				onComplete: function() {
					$kdarts_body.removeClass('kdarts-content-shown');
					$kdarts_body.removeClass('is-locked');
				}
			});
		}
	});	

	// Page Background
	if (jQuery('.kdarts-page-background[data-src]').length) {
		jQuery('.kdarts-page-background[data-src]').each(function() {
			jQuery(this).css('background-image', 'url('+ jQuery(this).data('src') +')');
		});
	}
	// Home Template
    if ($kdarts_body.hasClass('kdarts-home-template')) {	
		// Home Links Events
		jQuery('.kdarts-home-link').on('mouseenter', function() {
			$kdarts_body.addClass('is-faded');
		}).on('mouseleave', function() {
			$kdarts_body.removeClass('is-faded');
		}).on('click', function(){
			var $this = jQuery(this);
			kdarts.cursor.$el.removeClass('int-link');
			$kdarts_body.removeClass('is-faded').addClass('kdarts-content-shown');
			jQuery('.kdarts-home-link-wrap').addClass('is-inactive');
			gsap.to('.kdarts-page-background', {
				opacity: 0.1,
				scale: 1.05,
				duration: 1,
				delay: 0.5,
			});
			gsap.to('.kdarts-home-link--works', 0.5, {
				css: {
					top: 0,
				},
				delay: 0.5,
			});
			gsap.to('.kdarts-home-link--contacts', 0.5, {
				css: {
					top: '200%',
				},
				delay: 0.5,
			});
			
			jQuery('.kdarts-page-title').empty().append('<span>' + $this.find('span:first-child').text() + '</span>' + $this.find('span:last-child').text()).removeClass('is-inactive');
			jQuery('.kdarts-home-return').removeClass('is-inactive');
			
			gsap.to('.kdarts-page-title-wrap', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.kdarts-page-title-wrap').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.kdarts-back-wrap', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.kdarts-back-wrap').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			
			if ($this.parent().hasClass('kdarts-home-link--works')) {
				var $current_content = jQuery('#kdarts-home-works');
			}
			if ($this.parent().hasClass('kdarts-home-link--contacts')) {
				var $current_content = jQuery('#kdarts-home-contacts');
			}
			
			$current_content.wrap('\
				<main class="kdarts-content-wrap">\
					<div class="kdarts-content-scroll">\
						<div class="kdarts-content">\
							<section class="kdarts-section"></section>\
						</div><!-- .kdarts-content -->\
					</div><!-- .kdarts-content-scroll -->\
				</main>\
			');

			if ($kdarts_body.hasClass('kdarts-smooth-scroll')) {
				$kdarts_scroll = $kdarts_body.find('.kdarts-content-scroll');
				$kdarts_body.height($kdarts_scroll.height());
			}				
			kdarts.layout();
			
			gsap.fromTo('.kdarts-content', 1, {
				y: 100,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				duration: 1,
				delay: 1.2,
			});
		});
    }

	// All Links Events
	jQuery('a').on('click', function(e) {
		var $this = jQuery(this),
			this_href = $this.attr('href');
		if ($this.attr('target') && '_blank' == $this.attr('target')) {
			// Nothing to do here. Open link in new tab.
		} else {
			if (this_href == '#') {
				e.preventDefault();
			} else if ($this.hasClass('kdarts-lightbox-link')) {
				e.preventDefault();
			} else if (this_href.length > 1 && this_href[0] !== '#' && !/\.(jpg|png|gif)$/.test(this_href)) {
				e.preventDefault();
				kdarts.change_location(this_href);
			}
		}
	}).on('mousedown', function(e) {
		e.preventDefault();
	});
	
	// Masonry Items
	if (jQuery('.is-masonry').length) {
		jQuery('.is-masonry').each(function() {
			jQuery(this).masonry();
		});
	}
	
	// Init Coming Soon Counter
	if ( jQuery('#kdarts-coming-soon').length ) {
		kdarts.count_down.init();
	}	
	
	// Before After
	if (jQuery('.kdarts-before-after').length) {
		jQuery('.kdarts-before-after').each(function() {
			new kdarts_Before_After(jQuery(this));
		});
	}
	
	// Kenburns Sliders
	if (jQuery('.kdarts-kenburns-slider').length) {
		kdarts.kenburns.init();
	}

	// Tiny Slider
	if (jQuery('.kdarts-tns-container').length) {
		jQuery('.kdarts-tns-container').each(function(){
			let $this = jQuery(this),
				$parent = $this.parent(),
				kdarts_tns_options = {
					container: this,
					items: 1,
					axis: 'horizontal',
					mode: 'carousel',
					gutter: 0,
					edgePadding: 0,
					controls: false,
					nav: false,
					navPosition: 'bottom',
					speed: 1000,
					mouseDrag: true,
				};
		
			if ($parent.hasClass('kdarts-testimonials-carousel')) {
				kdarts_tns_options.autoHeight = true;
				kdarts_tns_options.center = true;
				kdarts_tns_options.nav = true;
				kdarts_tns_options.loop = true;
				kdarts_tns_options.gutter = 40;
			}
			
			// Init
			kdarts_tns[$this.attr('id')] = tns(kdarts_tns_options);
			
			// After Init Functions
			if ($parent.hasClass('kdarts-testimonials-carousel')) {
				kdarts_tns[$this.attr('id')].events.on('transitionEnd', kdarts.sScroll.layout);
			}
		});
	}
	
	// Counters
	if (jQuery('.kdarts-counter-item').length) {
		if ('IntersectionObserver' in window) {
			kdarts.counter_observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (!jQuery(entry.target).hasClass('is-counted')) {
						if(entry.isIntersecting) {
							jQuery(entry.target).addClass('is-counted');
							kdarts.counter(jQuery(entry.target).children('.kdarts-counter-value')[0]);
						}					
					}
				});
			});			
		} else {
			jQuery('.kdarts-counter-item').each(function() {
				jQuery(this).addClass('is-counted');
				kdarts.counter(jQuery(this).children('.kdarts-counter-value')[0]);
			});
		}
	}
	
	// Circle Progress Bar Init
	if (jQuery('.kdarts-progress-item').length) {
		jQuery('.kdarts-progress-item').each(function() {
			kdarts.progress.init(this);
		});
	}
	
	// Bricks Gallery
	if (jQuery('.kdarts-gallery-bricks.is-2x3').length) {
		jQuery('.kdarts-gallery-bricks.is-2x3').each(function() {
			let $this = jQuery(this),
				count = 0;
			
			$this.find('.kdarts-gallery-item').each(function(){
				count++;
				if (count > 5) {
					count = 1;
				}
				if (count == 1 || count == 2) {
					jQuery(this).addClass('is-large');
				} else {
					jQuery(this).addClass('is-small');
				}
			});
		});
	}
	
	// Lazy Loading Images
	if (jQuery('.lazy').length) {
		jQuery('.lazy').Lazy({
			scrollDirection: 'vertical',
			effect: 'fadeIn',
			visibleOnly: true,
			onError: function(element) {
				console.log('Error Loading ' + element.data('src'));
			},
			afterLoad: function(element) {
            	kdarts.layout();
        	},
		});		
	}
	
	// Justify Gallery
	if (jQuery('.kdarts-justified-gallery').length) {
		jQuery('.kdarts-justified-gallery').justifiedGallery({
			rowHeight : 250,
			captions: false,
			lastRow : 'nojustify',
			margins : 10
		});
	}
	
	// Lightbox
	if ( jQuery('.kdarts-lightbox-link').length ) {
		jQuery('.kdarts-lightbox-link').each( function() {
			let $this = jQuery(this),
				this_item = {},
				this_gallery = 'default';
			
			if ($this.data('size')) {
				let item_size = $this.attr('data-size').split('x');
				this_item.w = item_size[0];
				this_item.h = item_size[1];
			}
			this_item.src = $this.attr('href');
			
			if ( $this.data('caption') ) {
				this_item.title = $this.data('caption');
			}
			
			if ( $this.data('gallery') ) {
				this_gallery = $this.data('gallery');
			}
			
			if ( kdarts.pswp.gallery[this_gallery] ) {
				kdarts.pswp.gallery[this_gallery].push(this_item);
			} else {
				kdarts.pswp.gallery[this_gallery] = [];
				kdarts.pswp.gallery[this_gallery].push(this_item);
			}
			
			$this.data('count', kdarts.pswp.gallery[this_gallery].length - 1);
		});
			
		jQuery(document).on('click', '.kdarts-lightbox-link', function(e) {
			e.preventDefault();
			
			let $this = jQuery(this),
				this_index = parseInt($this.data('count'), 10),
				this_gallery = 'default',
				this_options = {
					index: this_index,
					bgOpacity: 0.85,
					showHideOpacity: true,
					getThumbBoundsFn: function(index) {
                        var thumbnail = $this[0],
                            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                            rect = thumbnail.getBoundingClientRect(); 
						
                        return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                    },
				};
			
			if ( $this.data('gallery') ) {
				this_gallery = $this.data('gallery');
			}
			
			kdarts.pswp.lightbox = new PhotoSwipe($kdarts_body.find('.pswp')[0], PhotoSwipeUI_Default, kdarts.pswp.gallery[this_gallery], this_options);
			kdarts.pswp.lightbox.init();
		});
	}
	
	// Contact Form
	if (jQuery('form.kdarts-contact-form').length) {
		jQuery('form.kdarts-contact-form').each(function() {
			let $this = jQuery(this),
				$response = $this.find('.kdarts-contact-form__response'),
				formData;
			
			$this.submit(function(e) {
				e.preventDefault();
				formData = jQuery(this).serialize();
				jQuery.ajax({
					type: 'POST',
					url: $this.attr('action'),
					data: formData
				})
				.done(function(response) {
					$response.empty().removeClass('alert-danger').addClass('alert-success');
					$response.html('<span>' + response + '</span>');
					setTimeout(function () {
						//$response.find('span').fadeOut();
					}, 2000);
        			$this.find('input:not([type="submit"]), textarea').val('');
				})
				.fail(function(data) {
					$response.empty().removeClass('alert-success').addClass('alert-danger');
					$response.html('<span>' + data.responseText) + '</span>';
					setTimeout(function () {
						//$response.find('span').fadeOut();
					}, 2000);
				});
			});
		});
	}
	
	// Spacer
	jQuery('.kdarts-spacer').each(function() {
		jQuery(this).height(jQuery(this).data('size'));
	});
	
    kdarts.layout();
    kdarts.loading();
}

kdarts.layout = function() {
	// Close Mobile Menu (if it don't use)
	if ($kdarts_window.width() > 760) {
		$kdarts_body.removeClass('kdarts-mobile-menu-shown');
	}
	
	// Header Space Holder
	if (typeof $kdarts_header_holder !== 'undefined') {
		$kdarts_header_holder.height($kdarts_header.height());
	}
	
	// Header Padding to Home Template
	if (jQuery('#kdarts-home-works').length) {
		jQuery('#kdarts-home-works').css('padding-top', $kdarts_header.height()+'px');
	}
	if (jQuery('#kdarts-home-contacts').length) {
		jQuery('#kdarts-home-contacts').css('padding-top', $kdarts_header.height()+'px');
	}
	
	// Relayout Masonry items
	if (jQuery('.is-masonry').length) {
		jQuery('.is-masonry').each(function() {
			jQuery(this).masonry('layout');
		});
	}

	// Services List Layout
	if (jQuery('.kdarts-service-item').length) {
		jQuery('.kdarts-service-item').each(function() {
			let $this = jQuery(this),
				$prev = $this.prev('.kdarts-service-item');			
			if ($kdarts_window.width() > 1200) {
				if ($prev.length) {
					var set_y = -1*($prev.height() - $prev.find('.kdarts-service-item__content').height())/2;
					$this.css('margin-top', set_y +'px');
				}				
			} else {
				$this.css('margin-top', '0px');
			}
		});
	}
		
	// Fullheight Row
	if (jQuery('.kdarts-row-fullheight').length) {
		jQuery('.kdarts-row-fullheight').each(function() {
			var $this = jQuery(this),
				minHeight = $kdarts_window.height();
			
			if ($this.hasClass('exclude-header')) {
				minHeight = minHeight - $kdarts_header.height();
			}
			if ($this.hasClass('exclude-footer')) {
				minHeight = minHeight - $kdarts_footer.height();
			}
			$this.css('min-height', minHeight+'px');
		});
	}
	
    // Dropdown Menu Position
    $kdarts_header.find('.kdarts-menu-offset').removeClass('kdarts-menu-offset');
    
    $kdarts_header.find('.sub-menu').each(function() {
        var $this = jQuery(this),
            this_left = $this.offset().left,
            this_left_full = $this.offset().left + $this.width() + parseInt($this.css('padding-left'), 10) + parseInt($this.css('padding-right'), 10);
		
		if ( this_left_full > $kdarts_window.width() ) {
			$this.addClass('kdarts-menu-offset');
		}
    });

	// Circle Progress Bar
	if (jQuery('.kdarts-progress-item').length) {
		jQuery('.kdarts-progress-item.is-done').each(function() {
			kdarts.progress.layout(this);
		});
	}
	
	// Smooth Scroll Functions
	kdarts.old_scroll_top = $kdarts_window.scrollTop();
	kdarts.sScroll.layout();	
}

kdarts.loading = function() {
	// Load Page Title and Guides
	if (jQuery('.kdarts-page-title-wrap:not(.is-inactive)').length) {
		gsap.to('.kdarts-page-title-wrap:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.kdarts-page-title-wrap:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}
	if (jQuery('.kdarts-back-wrap:not(.is-inactive)').length) {
		gsap.to('.kdarts-back-wrap:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.kdarts-back-wrap:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}
	if ($kdarts_body.hasClass('kdarts-home-template')) {
		gsap.to('.kdarts-home-link--works:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.kdarts-home-link--works:not(.is-inactive)').addClass('is-loaded');
			}
		});
		gsap.to('.kdarts-home-link--contacts:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.kdarts-home-link--contacts:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}
	
	let logoDelay = kdarts.config.content_load_delay;
	if ($kdarts_window.width() < 760) {
		logoDelay = 0.1;
	}
	// Load Logo
	gsap.from('.kdarts-logo', {
		x: '-50%',
		opacity: 0,
		duration: 0.5,
		delay: logoDelay
	});
	
	// Load Mobile Menu
	gsap.from('.kdarts-mobile-header > a', 
		{
			x: 10,
			y: -10,
			opacity: 0,		
			duration: 0.2,
			delay: 0.1,
			stagger: 0.1
		},
	);

	// Load Menu
	gsap.from('.kdarts-nav ul.main-menu > li', 
		{
			x: -10,
			y: -10,
			opacity: 0,		
			duration: 0.2,
			delay: kdarts.config.content_load_delay,
			stagger: 0.1
		},
	);
	
	// Footer Socials
	if (jQuery('.kdarts-footer__socials').length) {
		if ($kdarts_window.width() < 760) {
			gsap.from('.kdarts-footer__socials li', 
				{
					x: 0,
					y: 20,
					opacity: 0,		
					duration: 0.2,
					delay: kdarts.config.content_load_delay,
					stagger: 0.1
				},
			);			
		} else {
			gsap.from('.kdarts-footer__socials li', 
				{
					x: -10,
					y: -10,
					opacity: 0,		
					duration: 0.2,
					delay: kdarts.config.content_load_delay,
					stagger: 0.1
				},
			);			
		}
	}
	
	// Fotoer Copyright
	if (jQuery('.kdarts-footer__copyright').length) {
		if ($kdarts_window.width() < 760) {
			gsap.from('.kdarts-footer__copyright', {
				y: 20,
				opacity: 0,
				duration: 0.5,
				delay: kdarts.config.content_load_delay
			});
		} else {
			gsap.from('.kdarts-footer__copyright', {
				x: '50%',
				opacity: 0,
				duration: 0.5,
				delay: kdarts.config.content_load_delay
			});					
		}
	}
	
	// Page Background
	if (jQuery('.kdarts-page-background').length) {
		gsap.from('.kdarts-page-background', {
			scale: 1.05,
			opacity: 0,
			duration: 1,
			delay: kdarts.config.content_load_delay,
		});
	}
	
	// Show Content
	if (jQuery('.kdarts-content').length) {
		let contentDelay = kdarts.config.content_load_delay*1.7;
		if ($kdarts_window.width() < 760) {
			contentDelay = 0.5;
		}
		gsap.from('.kdarts-content', {
			opacity: 0,
			y: 100,
			duration: 1,
			delay: contentDelay,
			onStart: function() {
				kdarts.content_loaded();
			}
		});
	}
	
	// Show Albums Ribbon Content
	if (jQuery('.kdarts-albums-carousel').length) {
		if (jQuery('.kdarts-albums-carousel').hasClass('is-vertical')) {
			gsap.from('.kdarts-album-item__inner', {
				opacity: 0,
				y: 100,
				duration: 1,
				stagger: 0.1,
				delay: kdarts.config.content_load_delay*1.7
			});
		} else {
			gsap.from('.kdarts-album-item__inner', {
				opacity: 0,
				x: 100,
				duration: 1,
				stagger: 0.1,
				delay: kdarts.config.content_load_delay*1.7
			});			
		}
		if (kdarts_ribbon.$bar) {
			gsap.from(kdarts_ribbon.$bar[0], {
				opacity: 0,
				y: 20,
				duration: 1,
				delay: kdarts.config.content_load_delay*1.7
			});			
		}
	}
	
	// Show Albums Slider Content
	if (jQuery('.kdarts-albums-slider').length) {
		if (jQuery('.kdarts-album-item__title').length) {
			gsap.to('.kdarts-album-item__title', {
				css: {
					top: '100%',
				},
				delay: 0.5,
				duration: 1,
				onComplete: function() {
					jQuery('.kdarts-album-item__title').addClass('is-loaded');
				}
			});			
		}
		if (jQuery('.kdarts-album-item__explore').length) {
			gsap.to('.kdarts-album-item__explore', {
				css: {
					top: '100%',
				},
				delay: 0.5,
				duration: 1,
				onComplete: function() {
					jQuery('.kdarts-album-item__explore').addClass('is-loaded');
				}
			});
		}
		gsap.fromTo('.kdarts-slider-prev', {
			x: -50,
		},{
			x: 0,
			delay: kdarts.config.content_load_delay*1.7,
			duration: 0.5,
			onStart: function() {
				jQuery('.kdarts-slider-prev').addClass('is-loaded');
			}
		});
		gsap.fromTo('.kdarts-slider-next', {
			x: 50,
		},{
			x: 0,
			delay: kdarts.config.content_load_delay*1.7,
			duration: 0.5,
			onStart: function() {
				jQuery('.kdarts-slider-next').addClass('is-loaded');
			}
		});
		gsap.from('.kdarts-album-item__image', {
			scale: 1.05,
			opacity: 0,
			duration: 1,
			delay: kdarts.config.content_load_delay*1.7,
		});		
	}
	
	setTimeout("$kdarts_body.addClass('is-loaded')", 1500);
}

kdarts.change_location = function(this_href) {
	kdarts.cursor.$el.addClass('is-unloading');
	$kdarts_body.addClass('is-locked');
	if ($kdarts_window.width() < 760 && $kdarts_body.hasClass('kdarts-mobile-menu-shown')) {
		let setDelay = 0;
		$kdarts_body.addClass('is-locked');
		if (jQuery('.kdarts-mobile-menu').find('.is-open').length) {
			jQuery('.kdarts-mobile-menu').find('ul.sub-menu').slideUp(300);
			setDelay = 0.3;
		}
		gsap.fromTo('.kdarts-mobile-menu ul.main-menu > li', 
			{
				x: 0,
				y: 0,
				opacity: 1
			},
			{
				x: 0,
				y: -40,
				opacity: 0,
				duration: 0.2,
				delay: setDelay,
				stagger: 0.1,
				onComplete: function() {
					window.location = this_href;
				}
			},
		);
		return false;
	}
	$kdarts_body.removeClass('is-loaded');
	if ($kdarts_body.hasClass('kdarts-aside-shown')) {
		$kdarts_body.removeClass('kdarts-aside-shown');
	}
	if ($kdarts_body.hasClass('kdarts-mobile-menu-shown')) {
		$kdarts_body.removeClass('kdarts-mobile-menu-shown');
	}
	
	if (jQuery('.kdarts-content').length) {
		gsap.to('.kdarts-content', {
			css: {
				opacity: 0,
				y: -100,				
			},
			duration: 0.6,
		});
	}
	// Unload Albums Carousel Content
	if (jQuery('.kdarts-albums-carousel').length) {
		if (kdarts_ribbon.type == 'vertical') {
			gsap.to('.kdarts-album-item__inner.is-inview', {
				css: {
					opacity: 0,
					y: -100,
				},
				stagger: 0.1,
				delay: 0.5,
				duration: 0.6,
			});
		} else {
			gsap.to('.kdarts-album-item__inner.is-inview', {
				css: {
					opacity: 0,
					x: -100,				
				},
				stagger: 0.1,
				delay: 0.5,
				duration: 0.6,
			});			
		}
		if (kdarts_ribbon.$bar) {
			gsap.to(kdarts_ribbon.$bar[0], {
				opacity: 0,
				y: 20,
				duration: 1,
			});			
		}
	}

	// Unload Albums Slider Content
	if (jQuery('.kdarts-albums-slider').length) {
		if (jQuery('.kdarts-album-item__title').length) {
			setTimeout("jQuery('.kdarts-album-item__title').removeClass('is-loaded')", 300);
			gsap.to('.kdarts-album-item__title', {
				css: {
					top: '0%',
				},
				delay: 1.2,
				duration: 1,
			});
		}
		if (jQuery('.kdarts-album-item__explore').length) {
			setTimeout("jQuery('.kdarts-album-item__explore').removeClass('is-loaded')", 300);
			gsap.to('.kdarts-album-item__explore', {
				css: {
					top: '200%',
				},
				delay: 1.2,
				duration: 1,
			});
		}
		gsap.fromTo('.kdarts-slider-prev', {
			x: 0,
		},{
			x: -50,
			duration: 0.5,
			onStart: function() {
				jQuery('.kdarts-slider-prev').removeClass('is-loaded');
			}
		});
		gsap.fromTo('.kdarts-slider-next', {
			x: 0,
		},{
			x: 50,
			duration: 0.5,
			onStart: function() {
				jQuery('.kdarts-slider-next').removeClass('is-loaded');
			}
		});
		gsap.to('.kdarts-album-item__image', {
			css: {
				scale: 1.05,
				opacity: 0,				
			},
			duration: 1,
			delay: kdarts.config.content_load_delay*1.7,
		});		
	}

	// Remove Logo
	gsap.to('.kdarts-logo', {
		css: {
			x: '-50%',
			opacity: 0,			
		},
		duration: 0.5,
		delay: 0.5
	});

	// Remove Menu
	gsap.to('.kdarts-nav ul.main-menu > li', 
		{
			css: {
				x: -10,
				y: -10,
				opacity: 0,				
			},
			duration: 0.2,
			delay: 0.5,
			stagger: 0.1
		},
	);	
	
	// Unload Mobile Menu
	gsap.to('.kdarts-mobile-header > a', 
		{
			x: -10,
			y: -10,
			opacity: 0,		
			duration: 0.2,
			delay: 0.5,
			stagger: 0.1
		},
	);

	// Footer Socials
	if (jQuery('.kdarts-footer__socials').length) {
		gsap.to('.kdarts-footer__socials li', 
			{
				css: {
					x: -10,
					y: -10,
					opacity: 0,				
				},
				duration: 0.2,
				delay: 0.5,
				stagger: 0.1
			},
		);
	}
	
	// Fotoer Copyright
	if (jQuery('.kdarts-footer__copyright').length) {
		gsap.to('.kdarts-footer__copyright', {
			css: {
				x: '50%',
				opacity: 0,			
			},
			duration: 0.5,
			delay: 0.5
		});
	}

	// Remove Page Title and Guides
	if (jQuery('.kdarts-page-title-wrap').length) {
		setTimeout("jQuery('.kdarts-page-title-wrap:not(.is-inactive)').removeClass('is-loaded')", 600);
		gsap.to('.kdarts-page-title-wrap', 0.5, {
			css: {
				top: 0,
			},
			delay: 1.1,
		});
	}
	if (jQuery('.kdarts-back-wrap').length) {
		setTimeout("jQuery('.kdarts-back-wrap:not(.is-inactive)').removeClass('is-loaded')", 600);
		gsap.to('.kdarts-back-wrap', 0.5, {
			css: {
				top: '200%',
			},
			delay: 1.1,
		});
	}
	
	// Home Template Unloading
	if ($kdarts_body.hasClass('kdarts-home-template')) {
		if (!$kdarts_body.hasClass('kdarts-home-state--contacts') && !$kdarts_body.hasClass('kdarts-home-state--works')) {
			var links_delay = 0.5,
				links_timeout = 0;
		} else {
			var links_delay = 1.1,
				links_timeout = 600;
		}
		setTimeout("jQuery('.kdarts-home-link--works:not(.is-inactive)').removeClass('is-loaded')", links_timeout);
		gsap.to('.kdarts-home-link--works:not(.is-inactive)', 0.5, {
			css: {
				top: 0,
			},
			delay: links_delay,
		});
		setTimeout("jQuery('.kdarts-home-link--contacts:not(.is-inactive)').removeClass('is-loaded')", links_timeout);
		gsap.to('.kdarts-home-link--contacts:not(.is-inactive)', 0.5, {
			css: {
				top: '200%',
			},
			delay: links_delay,
		});
	}
	
	// Remove Page Background
	if (jQuery('.kdarts-page-background').length) {
		gsap.to('.kdarts-page-background', {
			css: {
				scale: 1.05,
				opacity: 0,				
			},
			duration: 1,
			delay: kdarts.config.content_load_delay*1.7,
		});
	}

	setTimeout( function() {
		$kdarts_body.addClass('is-unloaded');
		window.location = this_href;
	}, 2100, this_href);
}

// DOM Ready. Init Template Core.
jQuery(document).ready( function() {
    kdarts.init();
});

$kdarts_window.on('resize', function() {
	// Window Resize Actions
    kdarts.layout();
	setTimeout(kdarts.layout(), 500);
}).on('load', function() {
	// Window Load Actions
    kdarts.layout();
}).on('scroll', function() {
	if ($kdarts_body.hasClass('kdarts-aside-shown')) {
		$kdarts_window.scrollTop(kdarts.old_scroll_top);
	}
	if ($kdarts_body.hasClass('kdarts-mobile-menu-shown')) {
		$kdarts_window.scrollTop(kdarts.old_scroll_top);
	}
	kdarts.sScroll.target = $kdarts_window.scrollTop();
	if (kdarts.sScroll.target > ($kdarts_scroll.height() - $kdarts_window.height())) {
		kdarts.sScroll.layout();
	}
	
	//Window Scroll Actions
	if (jQuery('.kdarts-back.is-to-top:not(.in-action)').length) {
		if ($kdarts_window.scrollTop() > $kdarts_window.height()/2) {
			$kdarts_body.addClass('has-to-top');
		} else {
			$kdarts_body.removeClass('has-to-top');
		}
	}
}).on('focus', function() {
	if ($kdarts_body.hasClass('is-unloaded')) {
		window.location.reload();
	}
});

// Keyboard Controls
jQuery(document).on('keyup', function(e) {
	switch(e.keyCode) {
  		case 27:  // 'Esc' Key
			if ($kdarts_body.hasClass('kdarts-aside-shown')) {
				$kdarts_body.removeClass('kdarts-aside-shown');
			}
    	break;
  		default:
    	break;
	}
});

// Init Content After Loading
kdarts.content_loaded = function() {
	// Observing Counters
	if (jQuery('.kdarts-counter-item').length) {
		if ('IntersectionObserver' in window) {
			jQuery('.kdarts-counter-item').each(function() {
				kdarts.counter_observer.observe(this);
			});
		}
	}
	// Circle Progress Bar Init
	if (jQuery('.kdarts-progress-item').length) {
		if ('IntersectionObserver' in window) {
			jQuery('.kdarts-progress-item').each(function() {
				kdarts.progress.observer.observe(this);
			});
		}
	}
	kdarts.layout();
}