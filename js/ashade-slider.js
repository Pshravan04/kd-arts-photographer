/** 
 * Author: Shadow Themes
 * Author URL: http://shadow-themes.com
 */
"use strict";

let kdarts_slider = {
	isDown: false,
	isAnimate: false,
	$el: jQuery('.kdarts-albums-slider'),
	type: 'simple',
	indexPrev: 0,
	indexActive: 1,
	indexNext: 2,
	target: 0,
	direction: 'init',
	isTouch: false,
	drag: {
		start : 0,
		start_pos : 0,
		current : 0,
		path: 0,
		imgPrev : 0,
		imgActive : 0,
		imgNext : 0,
		percent: 0
	},
	init: function() {
		// Update Options
		if (kdarts_slider.$el.hasClass('is-parallax')) 
			kdarts_slider.type = 'parallax';
		if (kdarts_slider.$el.hasClass('is-fade'))  {
			kdarts_slider.type = 'fade';
			kdarts_slider.itemsCount = (kdarts_slider.$el.find('.kdarts-album-item').length - 1);
			kdarts_slider.indexPrev = kdarts_slider.itemsCount;
			kdarts_slider.indexActive = 0;
			kdarts_slider.indexNext = 1;
		} else {
			kdarts_slider.itemsCount = (kdarts_slider.$el.find('.kdarts-album-item').length + 1);
		}

		// Set Images
		kdarts_slider.$el.find('[data-src]').each(function() {
			jQuery(this).css('background-image', 'url('+ jQuery(this).data('src') +')');
		});

		// Append Last slide as First
		if (kdarts_slider.type !== 'fade') {
			var $first_slide = kdarts_slider.$el.find('.kdarts-album-item:first-child').clone(),
				$last_slide = kdarts_slider.$el.find('.kdarts-album-item:last-child').clone();
			$first_slide.addClass('is-copy').appendTo(kdarts_slider.$el);
			$last_slide.addClass('is-copy').prependTo(kdarts_slider.$el);
			kdarts_slider.$el.css('transform', 'translate(-'+ $kdarts_window.width()+'px, 0px)');
		} else {
			kdarts_slider.$el.find('.kdarts-album-item__image').css('transform', 'scale(1.05)');
			kdarts_slider.$el.find('.kdarts-album-item').css('opacity', '0');
		}

		// Layout
		kdarts_slider.layout();

		// Bind Mouse Actions
		kdarts_slider.$el.on('mousedown', function(e) {
			e.preventDefault();
			if (kdarts_slider.isTouch) {
				kdarts_slider.isTouch = false;
			}
			if (!kdarts_slider.isAnimate) {
				kdarts_slider.isDown = true;
				kdarts_slider.drag.start = e.clientX;
				if (kdarts_slider.type !== 'fade') {
					let posMatrix = kdarts_slider.$el.css('transform').split(',');
					kdarts_slider.drag.start_pos = parseInt(posMatrix[4], 10);
				}
			}
		}).on('mouseup', function() {
			kdarts_slider.isDown = false;
			kdarts_slider.action.dragBreak();
		}).on('mouseleave', function() {
			kdarts_slider.isDown = false;
			kdarts_slider.action.dragBreak();
		}).on('mousemove', function(e) {
			e.preventDefault();
			if (kdarts_slider.isDown) {
				if (kdarts_slider.type == 'fade') {
					// Fade Movement
					kdarts_slider.drag.current = kdarts_slider.drag.start - e.clientX;
					kdarts_slider.drag.percent = parseFloat(kdarts_slider.drag.current/$kdarts_window.width()).toFixed(2);
					if (kdarts_slider.drag.percent < 0) {
						kdarts_slider.drag.path = 'prev';
						kdarts_slider.drag.percent = -1*kdarts_slider.drag.percent;
						let zoom_prev = 1.05 - (kdarts_slider.drag.percent*0.05);
						kdarts_slider.$el_prev.css('opacity', kdarts_slider.drag.percent);
						kdarts_slider.$prevImage.css('transform', 'scale('+ zoom_prev +')');
					} else {
						kdarts_slider.drag.path = 'next';
						let zoom_next = 1.05 - (kdarts_slider.drag.percent*0.05);
						kdarts_slider.$el_next.css('opacity', kdarts_slider.drag.percent);
						kdarts_slider.$nextImage.css('transform', 'scale('+ zoom_next +')');
					}
					let zoom_active = 1+(kdarts_slider.drag.percent*0.05);
					kdarts_slider.$el_active.css('opacity', 1-kdarts_slider.drag.percent);
					kdarts_slider.$activeImage.css('transform', 'scale('+ zoom_active +')');
				} else {
					// Slide Movement
					kdarts_slider.drag.current = kdarts_slider.drag.start - e.clientX;
					kdarts_slider.drag.path = kdarts_slider.drag.start_pos - kdarts_slider.drag.current;

					if (kdarts_slider.type == 'parallax') {
						kdarts_slider.drag.imgPrev = $kdarts_window.width()/2 + kdarts_slider.drag.current/2,
						kdarts_slider.drag.imgActive = kdarts_slider.drag.current/2,
						kdarts_slider.drag.imgNext = -1*($kdarts_window.width()/2 - kdarts_slider.drag.current/2);

						kdarts_slider.$prevImage.css('transform', 'translateX(' + kdarts_slider.drag.imgPrev + 'px)');
						kdarts_slider.$activeImage.css('transform', 'translateX(' + kdarts_slider.drag.imgActive + 'px)');
						kdarts_slider.$nextImage.css('transform', 'translateX(' + kdarts_slider.drag.imgNext + 'px)');
					}

					kdarts_slider.$el.css('transform', 'translate('+ kdarts_slider.drag.path +'px, 0px)');
				}
			}
		});

		// Bind Touch Events
		kdarts_slider.$el[0].addEventListener('touchstart', function(e) {
			if (!kdarts_slider.isTouch) {
				kdarts_slider.isTouch = true;
			}
			if (!kdarts_slider.isAnimate) {
				kdarts_slider.isDown = true;
				kdarts_slider.drag.start = e.touches[0].clientX;
				if (kdarts_slider.type !== 'fade') {
					let posMatrix = kdarts_slider.$el.css('transform').split(',');
					kdarts_slider.drag.start_pos = parseInt(posMatrix[4], 10);
				}
			}
		}, false);
		kdarts_slider.$el[0].addEventListener('touchmove', function(e) {
			e.preventDefault();
			if (kdarts_slider.isDown) {
				if (kdarts_slider.type == 'fade') {
					// Fade Movement
					kdarts_slider.drag.current = kdarts_slider.drag.start - e.touches[0].clientX;
					kdarts_slider.drag.percent = parseFloat(kdarts_slider.drag.current/$kdarts_window.width()).toFixed(2);
					if (kdarts_slider.drag.percent < 0) {
						kdarts_slider.drag.path = 'prev';
						kdarts_slider.drag.percent = -1*kdarts_slider.drag.percent;
						let zoom_prev = 1.05 - (kdarts_slider.drag.percent*0.05);
						kdarts_slider.$el_prev.css('opacity', kdarts_slider.drag.percent);
						kdarts_slider.$prevImage.css('transform', 'scale('+ zoom_prev +')');
					} else {
						kdarts_slider.drag.path = 'next';
						let zoom_next = 1.05 - (kdarts_slider.drag.percent*0.05);
						kdarts_slider.$el_next.css('opacity', kdarts_slider.drag.percent);
						kdarts_slider.$nextImage.css('transform', 'scale('+ zoom_next +')');
					}
					let zoom_active = 1+(kdarts_slider.drag.percent*0.05);
					kdarts_slider.$el_active.css('opacity', 1-kdarts_slider.drag.percent);
					kdarts_slider.$activeImage.css('transform', 'scale('+ zoom_active +')');
				} else {
					// Slide Movement
					kdarts_slider.drag.current = kdarts_slider.drag.start - e.touches[0].clientX;
					kdarts_slider.drag.path = kdarts_slider.drag.start_pos - kdarts_slider.drag.current;

					if (kdarts_slider.type == 'parallax') {
						kdarts_slider.drag.imgPrev = $kdarts_window.width()/2 + kdarts_slider.drag.current/2,
						kdarts_slider.drag.imgActive = kdarts_slider.drag.current/2,
						kdarts_slider.drag.imgNext = -1*($kdarts_window.width()/2 - kdarts_slider.drag.current/2);

						kdarts_slider.$prevImage.css('transform', 'translateX(' + kdarts_slider.drag.imgPrev + 'px)');
						kdarts_slider.$activeImage.css('transform', 'translateX(' + kdarts_slider.drag.imgActive + 'px)');
						kdarts_slider.$nextImage.css('transform', 'translateX(' + kdarts_slider.drag.imgNext + 'px)');
					}

					kdarts_slider.$el.css('transform', 'translate('+ kdarts_slider.drag.path +'px, 0px)');
				}
			}			
		}, false);
		kdarts_slider.$el[0].addEventListener('touchend', function(e) {
			kdarts_slider.isDown = false;
			kdarts_slider.action.dragBreak();			
		}, false);

		// Bind Button Events
		kdarts_slider.$el.parent().find('a.kdarts-slider-prev').on('click', function() {
			if (!kdarts_slider.isAnimate) {
				kdarts_slider.action.from = 'button';
				kdarts_slider.action.prev();
			}
		});
		kdarts_slider.$el.parent().find('a.kdarts-slider-next').on('click', function() {
			if (!kdarts_slider.isAnimate) {
				kdarts_slider.action.from = 'button';
				kdarts_slider.action.next();
			}
		});
	},
	layout: function() {
		if (kdarts_slider.type !== 'fade') {
			let setWidth = $kdarts_window.width()*kdarts_slider.itemsCount;
			kdarts_slider.$el.width(setWidth);
		}
		kdarts_slider.action.from = 'layout';
		kdarts_slider.action.set();
	},
	action: {
		from: '',
		dragBreak: function() {
			if (kdarts_slider.type == 'fade') {
				if (kdarts_slider.drag.percent > 0.25) {
					kdarts_slider.action.from = 'slide';
					if (kdarts_slider.drag.path == 'prev') {
						kdarts_slider.action.prev();
					} else {
						kdarts_slider.action.next();
					}
				} else if(kdarts_slider.drag.percent !== 0) {
					kdarts_slider.action.from = 'layout';
					kdarts_slider.action.set();
				}
				kdarts_slider.drag.percent = 0;
			} else {
				if (kdarts_slider.drag.current > 100) {
					kdarts_slider.action.from = 'slide';
					kdarts_slider.action.next();
				} else if (kdarts_slider.drag.current < -100) {
					kdarts_slider.action.from = 'slide';
					kdarts_slider.action.prev();
				} else if (kdarts_slider.drag.current !== 0) {
					kdarts_slider.action.from = 'layout';
					kdarts_slider.action.set();
				}
			}
			kdarts_slider.drag.percent = kdarts_slider.drag.current = 0;

		},
		next : function() {
			kdarts_slider.indexPrev++,
			kdarts_slider.indexActive++,
			kdarts_slider.indexNext++;
			kdarts_slider.direction = 'next';

			if (kdarts_slider.indexPrev > kdarts_slider.itemsCount) {
				kdarts_slider.indexPrev = 0;
			}
			if (kdarts_slider.indexActive > kdarts_slider.itemsCount) {
				kdarts_slider.indexActive = 0;
			}
			if (kdarts_slider.indexNext > kdarts_slider.itemsCount) {
				kdarts_slider.indexNext = 0;
			}
			kdarts_slider.action.set();
		},
		prev : function() {
			kdarts_slider.indexPrev--,
			kdarts_slider.indexActive--,
			kdarts_slider.indexNext--;
			kdarts_slider.direction = 'prev';

			if (kdarts_slider.indexPrev < 0 ) {
				kdarts_slider.indexPrev = kdarts_slider.itemsCount;
			}
			if (kdarts_slider.indexActive < 0) {
				kdarts_slider.indexActive = kdarts_slider.itemsCount;
			}
			if (kdarts_slider.indexNext < 0) {
				kdarts_slider.indexNext = kdarts_slider.itemsCount;
			}		
			kdarts_slider.action.set();
		},
		set : function() {
			kdarts_slider.isAnimate = true;

			if (kdarts_slider.type == 'fade') {
				// Fading Layout Set
				kdarts_slider.$el_prev = kdarts_slider.$el.find('.kdarts-album-item').eq(kdarts_slider.indexPrev);
				kdarts_slider.$el_active = kdarts_slider.$el.find('.kdarts-album-item').eq(kdarts_slider.indexActive);
				kdarts_slider.$el_next = kdarts_slider.$el.find('.kdarts-album-item').eq(kdarts_slider.indexNext);

				kdarts_slider.$prevImage = kdarts_slider.$el_prev.find('.kdarts-album-item__image');
				kdarts_slider.$activeImage = kdarts_slider.$el_active.find('.kdarts-album-item__image');
				kdarts_slider.$nextImage = kdarts_slider.$el_next.find('.kdarts-album-item__image');

				kdarts_slider.$el.find('.is-prev').removeClass('is-prev');
				kdarts_slider.$el.find('.is-active').removeClass('is-active');
				kdarts_slider.$el.find('.is-next').removeClass('is-next');

				kdarts_slider.$el_prev.addClass('is-prev');
				kdarts_slider.$el_active.addClass('is-active');
				kdarts_slider.$el_next.addClass('is-next');

				let slideEasing = Power1.easeInOut,
					startOpacity = 0,
					startOpacityInactive = 1,
					startScale = 1.05,
					startScaleInactive = 1,
					$inActive = (kdarts_slider.direction == 'next' ? kdarts_slider.$el_prev : kdarts_slider.$el_next),
					$inActiveImage = (kdarts_slider.direction == 'next' ? kdarts_slider.$prevImage : kdarts_slider.$nextImage);

				if (kdarts_slider.action.from == 'slide') {
					slideEasing = Power1.easeOut;
					startOpacity = parseFloat(kdarts_slider.$el_active.css('opacity'));
					startOpacityInactive = parseFloat($inActive.css('opacity'));
					let scaleMatrix = kdarts_slider.$activeImage.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
					startScale = parseFloat(scaleMatrix[0]);
					scaleMatrix = $inActiveImage.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
					startScaleInactive = parseFloat(scaleMatrix[0]);
				}
				if (kdarts_slider.action.from == 'layout') {
					$inActive = (kdarts_slider.drag.path == 'next' ? kdarts_slider.$el_next : kdarts_slider.$el_prev),
					$inActiveImage = (kdarts_slider.drag.path == 'next' ? kdarts_slider.$nextImage : kdarts_slider.$prevImage);
					startOpacity = parseFloat(kdarts_slider.$el_active.css('opacity'));
					startOpacityInactive = parseFloat($inActive.css('opacity'));
					let scaleMatrix = kdarts_slider.$activeImage.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
					startScale = parseFloat(scaleMatrix[0]);
					scaleMatrix = $inActiveImage.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
					startScaleInactive = parseFloat(scaleMatrix[0]);
				}

				gsap.fromTo(kdarts_slider.$el_active, 
				{
					css: {
						opacity: startOpacity
					}
				},
				{
					css: {
						opacity: 1
					},
					duration: 1,
					ease: slideEasing,
					onComplete: function() {
						kdarts_slider.action.from = '';
						kdarts_slider.isAnimate = false;
					}
				});
				gsap.fromTo(kdarts_slider.$activeImage, 
				{
					scale: startScale
				},
				{
					scale: 1,
					duration: 1,
					ease: slideEasing,
				});
				gsap.fromTo($inActive, {
					css: {
						opacity: startOpacityInactive
					}
				},
				{
					css: {
						opacity: 0,
					},
					duration: 1,
					ease: slideEasing
				});
				gsap.fromTo($inActiveImage,{
					scale: startScaleInactive
				},
				{
					scale: 1.05,
					duration: 1,
					ease: slideEasing
				});
			} else {
				// Sliding Layout Set
				if (kdarts_slider.action.from == 'button') {
					if (kdarts_slider.direction == 'next' && kdarts_slider.indexActive == kdarts_slider.itemsCount) {
						kdarts_slider.indexPrev = 0;
						kdarts_slider.indexActive = 1;
						kdarts_slider.indexNext = 2;
						kdarts_slider.$el.css('transform', 'translate(0px, 0px)');
					}
					if (kdarts_slider.direction == 'prev' && kdarts_slider.indexActive == 0) {
						kdarts_slider.indexPrev = kdarts_slider.itemsCount - 2;
						kdarts_slider.indexActive = kdarts_slider.itemsCount - 1;
						kdarts_slider.indexNext = kdarts_slider.itemsCount;
						kdarts_slider.$el.css('transform', 'translate(-'+ $kdarts_window.width()*kdarts_slider.itemsCount +'px, 0px)');
					}
				}

				kdarts_slider.target = $kdarts_window.width()*kdarts_slider.indexActive;

				kdarts_slider.$el_prev = kdarts_slider.$el.find('.kdarts-album-item').eq(kdarts_slider.indexPrev);
				kdarts_slider.$el_active = kdarts_slider.$el.find('.kdarts-album-item').eq(kdarts_slider.indexActive);
				kdarts_slider.$el_next = kdarts_slider.$el.find('.kdarts-album-item').eq(kdarts_slider.indexNext);

				if (kdarts_slider.type == 'parallax') {
					kdarts_slider.$prevImage = kdarts_slider.$el_prev.find('.kdarts-album-item__image');
					kdarts_slider.$activeImage = kdarts_slider.$el_active.find('.kdarts-album-item__image');
					kdarts_slider.$nextImage = kdarts_slider.$el_next.find('.kdarts-album-item__image');
				}

				let posMatrix = kdarts_slider.$el.css('transform').split(',');

				let slideEasing = Power2.easeInOut;
				if (kdarts_slider.action.from == 'slide') {
					slideEasing = Power2.easeOut
				}
				if (kdarts_slider.type == 'parallax') {
					// Images Parallax Effect
					if (kdarts_slider.direction == 'next' && kdarts_slider.action.from !== 'layout') {
						if (kdarts_slider.drag.imgNext !== 0) {
							var active_from = kdarts_slider.drag.imgNext;
						} else {
							var active_from = -1*$kdarts_window.width()/2;
						}
						if (kdarts_slider.drag.imgActive !== 0) {
							var prev_from = kdarts_slider.drag.imgActive;
						} else {
							var prev_from = 0;
						}
						gsap.fromTo(kdarts_slider.$activeImage, {
							x: active_from,
							duration: 1,
							ease: slideEasing
						},{
							x: 0,
							duration: 1,
							ease: slideEasing,
						});
						gsap.fromTo(kdarts_slider.$prevImage, {
							x: prev_from,
							duration: 1,
							ease: slideEasing,
						},{
							x: $kdarts_window.width()/2,
							duration: 1,
							ease: slideEasing
						});
					}
					if (kdarts_slider.direction == 'prev' && kdarts_slider.action.from !== 'layout') {
						if (kdarts_slider.drag.imgNext !== 0) {
							var active_from = kdarts_slider.drag.imgPrev;
						} else {
							var active_from = $kdarts_window.width()/2;
						}
						if (kdarts_slider.drag.imgActive !== 0) {
							var next_from = kdarts_slider.drag.imgActive;
						} else {
							var next_from = 0;
						}
						gsap.fromTo(kdarts_slider.$activeImage, {
							x: active_from,
							duration: 1,
							ease: slideEasing
						},{
							x: 0,
							duration: 1,
							ease: slideEasing,
						});
						gsap.fromTo(kdarts_slider.$nextImage, {
							x: next_from,
							duration: 1,
							ease: slideEasing
						},{
							x: -$kdarts_window.width()/2,
							duration: 1,
							ease: slideEasing,
						});
					}
					if (kdarts_slider.action.from == 'layout') {
						gsap.to(kdarts_slider.$prevImage, {
							x: $kdarts_window.width()/2,
							duration: 1,
							ease: slideEasing,
						});
						gsap.to(kdarts_slider.$activeImage, {
							x: 0,
							duration: 1,
							ease: slideEasing,
						});
						gsap.to(kdarts_slider.$nextImage, {
							x: -$kdarts_window.width()/2,
							duration: 1,
							ease: slideEasing,
						});
					}
				}
				gsap.fromTo(kdarts_slider.$el, 
				{
					x: parseInt(posMatrix[4], 10)
				},
				{
					x: -kdarts_slider.target,
					duration: 1,
					ease: slideEasing,
					onComplete: function() {
						if (kdarts_slider.action.from == 'slide') {
							if (kdarts_slider.direction == 'next' && kdarts_slider.indexActive == kdarts_slider.itemsCount) {
								kdarts_slider.indexPrev = 0;
								kdarts_slider.indexActive = 1;
								kdarts_slider.indexNext = 2;
								kdarts_slider.$el.css('transform', 'translate(-'+ $kdarts_window.width() +'px, 0px)');
								kdarts_slider.isAnimate = false;
							}
							if (kdarts_slider.direction == 'prev' && kdarts_slider.indexActive == 0) {
								kdarts_slider.indexPrev = kdarts_slider.itemsCount - 2;
								kdarts_slider.indexActive = kdarts_slider.itemsCount - 1;
								kdarts_slider.indexNext = kdarts_slider.itemsCount;
								kdarts_slider.$el.css('transform', 'translate(-'+ $kdarts_window.width()*(kdarts_slider.itemsCount-1) +'px, 0px)');
							}
						}

						kdarts_slider.$el_prev = kdarts_slider.$el.find('.kdarts-album-item').eq(kdarts_slider.indexPrev);
						kdarts_slider.$el_active = kdarts_slider.$el.find('.kdarts-album-item').eq(kdarts_slider.indexActive);
						kdarts_slider.$el_next = kdarts_slider.$el.find('.kdarts-album-item').eq(kdarts_slider.indexNext);

						if (kdarts_slider.type == 'parallax') {
							kdarts_slider.$prevImage = kdarts_slider.$el_prev.find('.kdarts-album-item__image');
							kdarts_slider.$activeImage = kdarts_slider.$el_active.find('.kdarts-album-item__image');
							kdarts_slider.$nextImage = kdarts_slider.$el_next.find('.kdarts-album-item__image');

							kdarts_slider.$prevImage.css('transform', 'translateX(0)');
							kdarts_slider.$activeImage.css('transform', 'translateX(0)');
							kdarts_slider.$nextImage.css('transform', 'translateX(0)');
						}

						kdarts_slider.$el.find('.is-prev').removeClass('is-prev');
						kdarts_slider.$el.find('.is-active').removeClass('is-active');
						kdarts_slider.$el.find('.is-next').removeClass('is-next');

						kdarts_slider.$el_prev.addClass('is-prev');
						kdarts_slider.$el_active.addClass('is-active');
						kdarts_slider.$el_next.addClass('is-next');

						kdarts_slider.action.from = '';
						kdarts_slider.isAnimate = false;
					}
				});

				if (kdarts_slider.type == 'parallax') {
					kdarts_slider.drag.imgPrev = 0,
					kdarts_slider.drag.imgActive = 0,
					kdarts_slider.drag.imgNext = 0;
				}
			}
		}
	},
};

jQuery(document).ready(function() {
	if (kdarts_slider.$el) {
		kdarts_slider.init();
	}
});

jQuery(window).on('load', function(){
	kdarts_slider.layout();
}).on('resize', function(){
	kdarts_slider.layout();
});

// Bind Keyboard Controls
jQuery(document).on('keyup', function(e) {
	switch(e.keyCode) {
  		case 39:  // 'Right Arrow' Key
			if (!kdarts_slider.isAnimate) {
				kdarts_slider.action.from = 'button';
				kdarts_slider.action.next();
			}
    	break;
  		case 37:  // 'Left Arrow' Key
			if (!kdarts_slider.isAnimate) {
				kdarts_slider.action.from = 'button';
				kdarts_slider.action.prev();
			}
    	break;

  		default:
    	break;
	}
});

// Bind Mouse Wheel Control
kdarts_slider.$el[0].addEventListener('wheel', kdartsMouseWheel);
function kdartsMouseWheel(e) {
	if (!kdarts_slider.isAnimate) {
		if (e.deltaY > 0) {
			kdarts_slider.action.from = 'button';
			kdarts_slider.action.next();
		}		
		if (e.deltaY < 0) {
			kdarts_slider.action.from = 'button';
			kdarts_slider.action.prev();
		}		
	}
}
