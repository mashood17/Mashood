if ($("body").hasClass("tw-magic-cursor")) {
  $(".tw-magnetic-item").wrap('<div class="tw-magnetic-wrap"></div>');

  if ($("a.tw-magnetic-item").length) {
    $("a.tw-magnetic-item").addClass("not-hide-cursor");
  }

  var $mouse = { x: -100, y: -100 }; // Cursor position
  var $pos = { x: -100, y: -100 }; // Cursor position
  var $ratio = 0.15; // delay follow cursor
  var $active = false;
  var $ball = $("#ball");

  var $ballWidth = 5; // Ball default width
  var $ballHeight = 5; // Ball default height
  var $ballScale = 1; // Ball default scale
  var $ballOpacity = 1; // Ball default opacity
  var $ballBorderWidth = 1; // Ball default border width

  gsap.set($ball, {
    xPercent: -50,
    yPercent: -50,
    width: $ballWidth,
    height: $ballHeight,
    borderWidth: $ballBorderWidth,
    opacity: $ballOpacity,
  });

  var isTicking = false;
  var cursorVisible = false;

  function updatePosition() {
    if (!$active) {
      var dx = $mouse.x - $pos.x;
      var dy = $mouse.y - $pos.y;
      $pos.x += dx * $ratio;
      $pos.y += dy * $ratio;

      gsap.set($ball, { x: $pos.x, y: $pos.y });

      // Sleep ticker when close enough to save idle CPU
      if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
        $pos.x = $mouse.x;
        $pos.y = $mouse.y;
        gsap.set($ball, { x: $pos.x, y: $pos.y });
        gsap.ticker.remove(updatePosition);
        isTicking = false;
      }
    }
  }

  document.addEventListener("mousemove", mouseMove, { passive: true });

  function mouseMove(e) {
    $mouse.x = e.clientX;
    $mouse.y = e.clientY;

    if (!cursorVisible) {
      cursorVisible = true;
      $pos.x = e.clientX;
      $pos.y = e.clientY;
      gsap.set($ball, { x: $pos.x, y: $pos.y });
      gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
    }

    if (!isTicking) {
      isTicking = true;
      gsap.ticker.add(updatePosition);
    }
  }

  // Show/hide magic cursor on window enter/leave
  $(document)
    .on("mouseleave", function () {
      cursorVisible = false;
      gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 0 });
    })
    .on("mouseenter", function () {
      cursorVisible = true;
      gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
    });

  // Hide on hover
  $("a, button, .tw-cart-minus, .tw-cart-plus")
    .not(".cursor-hide")
    .on("mouseenter", function () {
      gsap.to($ball, { duration: 0.3, scale: 0, opacity: 0 });
    })
    .on("mouseleave", function () {
      gsap.to($ball, {
        duration: 0.3,
        scale: $ballScale,
        opacity: $ballOpacity,
      });
    });

  // Hide on click
  $("a")
    .not('[target="_blank"]')
    .not(".cursor-hide")
    .not('[href^="#"]')
    .not('[href^="mailto"]')
    .not('[href^="tel"]')
    .not(".lg-trigger")
    .not(".tw-btn-disabled a")
    .on("click", function () {
      gsap.to($ball, { duration: 0.3, scale: 1.3, autoAlpha: 0 });
    });

  // Cursor view on hover (data attribute "data-cursor=...")
  $("[data-cursor]").each(function () {
    $(this)
      .on("mouseenter", function () {
        $("#ball").addClass("with-blur");
        $ball.append('<div class="ball-view"></div>');
        $(".ball-view").append($(this).attr("data-cursor"));
        gsap.to($ball, {
          duration: 0.3,
          yPercent: -75,
          width: 140,
          height: 140,
          opacity: 1,
          borderWidth: 1,
          zIndex: 1,
          backdropFilter: "blur(14px)",
          backgroundColor: "#ff6644",
          boxShadow: "0px 1px 3px 0px rgba(18, 20, 32, 0.14)",
        });
        gsap.to(".ball-view", { duration: 0.3, scale: 1, autoAlpha: 1 });
      })
      .on("mouseleave", function () {
        gsap.to($ball, {
          duration: 0.3,
          yPercent: -50,
          width: $ballWidth,
          height: $ballHeight,
          opacity: $ballOpacity,
          borderWidth: $ballBorderWidth,
          backgroundColor: "#1c1d21",
        });
        gsap.to(".ball-view", {
          duration: 0.3,
          scale: 0,
          autoAlpha: 0,
          clearProps: "all",
        });
        $ball.find(".ball-view").remove();
      });
    $(this).addClass("not-hide-cursor");
  });
}
