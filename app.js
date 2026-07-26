/* ==========================================================================
   LOT — Interactive Experience Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // 1. Custom Cursor Execution
  const cursor = document.querySelector(".custom-cursor");
  const hasPointer = window.matchMedia("(any-hover: hover)").matches;

  if (!hasPointer) {
    cursor.style.display = "none";
  } else {
    document.addEventListener("mousemove", (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
    });

    const addHoverState = () => {
      cursor.classList.add("hovered");
    };
    const removeHoverState = () => {
      cursor.classList.remove("hovered");
    };

    const attachCursorHovers = () => {
      const hoverables = document.querySelectorAll("a, button, .hotspot, .faq-question, .feature-card, #btn-tamper-trigger, #btn-tamper-reset, #btn-simulate-nfc, #btn-replay-route");
      hoverables.forEach(el => {
        el.removeEventListener("mouseenter", addHoverState);
        el.removeEventListener("mouseleave", removeHoverState);
        el.addEventListener("mouseenter", addHoverState);
        el.addEventListener("mouseleave", removeHoverState);
      });
    };

    attachCursorHovers();
    // Observe DOM changes to attach cursors to dynamically modified elements
    const observer = new MutationObserver(attachCursorHovers);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 2. Navbar Scrolling Aesthetic
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 3. Smooth Scrolling Initialization (Lenis)
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Link GSAP ScrollTrigger to Lenis Scroll
  lenis.on('scroll', ScrollTrigger.update);

  // 4. Preloading & Canvas Sequence Logic
  const canvas = document.getElementById("sequence-canvas");
  const context = canvas.getContext("2d");

  let lastRenderedFrame = -1;

  function resizeSequenceCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeSequenceCanvas();

  const frameCount = 121;
  let detectedPrefix = "";
  let useAbsoluteRoot = false;
  const currentFramePath = index => `${useAbsoluteRoot ? '/' : ''}${detectedPrefix}ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

  const images = [];
  const airtag = { frame: 0 };
  let loadedCount = 0;

  function detectImagePath() {
    return new Promise((resolve) => {
      const testPaths = [
        '/ezgif-frame-001.jpg',
        '/frames/ezgif-frame-001.jpg',
        'ezgif-frame-001.jpg',
        'frames/ezgif-frame-001.jpg'
      ];

      const tryNext = () => {
        if (!testPaths.length) {
          useAbsoluteRoot = false;
          detectedPrefix = "";
          console.warn('[Detection] Could not detect image path. Falling back to root relative path.');
          resolve();
          return;
        }

        const path = testPaths.shift();
        const testImage = new Image();
        testImage.onload = () => {
          useAbsoluteRoot = path.startsWith('/');
          detectedPrefix = path.includes('/frames/') ? 'frames/' : '';
          console.log(`[Detection] Working path detected: ${path}`);
          resolve();
        };
        testImage.onerror = tryNext;
        testImage.src = path;
      };

      console.log('[Detection] Initiating path detection...');
      tryNext();
    });
  }

  function preloadSequence() {
    return new Promise((resolve) => {
      console.log(`[Preloader] Starting preload of ${frameCount} frames...`);
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const path = currentFramePath(i);
        img.decoding = 'async';
        img.src = path;
        img.onload = () => {
          loadedCount++;
          const progress = Math.round((loadedCount / frameCount) * 100);
          const progressBar = document.querySelector('.preloader-bar-fill');
          const progressText = document.querySelector('.preloader-percentage');
          if (progressBar) progressBar.style.width = `${progress}%`;
          if (progressText) progressText.textContent = `${progress}%`;
          console.log(`[Preloader] Frame loaded: ${loadedCount}/${frameCount} (${progress}%) - Path: ${path}`);

          if (loadedCount === 1) {
            drawFrame();
          }

          if (loadedCount === frameCount) {
            console.log("[Preloader] All frames loaded successfully.");
            resolve();
          }
        };
        img.onerror = () => {
          loadedCount++;
          console.error(`[Preloader] Failed to load frame ${i} at path: ${path}`);
          if (loadedCount === frameCount) {
            console.log("[Preloader] Preload finished with errors.");
            resolve();
          }
        };
        images.push(img);
      }
    });
  }

  function drawFrame() {
    const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.round(airtag.frame)));

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    context.clearRect(0, 0, rect.width, rect.height);
    const img = images[frameIndex];
    if (img && img.complete && img.naturalWidth > 0) {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const canvasRatio = rect.width / rect.height;
      const imgRatio = imgWidth / imgHeight;

      let drawWidth = rect.width;
      let drawHeight = rect.height;
      let offsetX = 0;
      let offsetY = 0;

      // Preserve aspect ratio and fill the viewport as much as possible (cover style)
      if (imgRatio > canvasRatio) {
        drawHeight = rect.height;
        drawWidth = rect.height * imgRatio;
        offsetX = (rect.width - drawWidth) / 2;
      } else {
        drawWidth = rect.width;
        drawHeight = rect.width / imgRatio;
        offsetY = (rect.height - drawHeight) / 2;
      }

      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      console.log(`[Render] drawImage() called: Frame #${frameIndex} (${imgWidth}x${imgHeight}) drawn at offset (${offsetX.toFixed(1)}, ${offsetY.toFixed(1)}) with size ${drawWidth.toFixed(1)}x${drawHeight.toFixed(1)}`);
    } else {
      console.warn(`[Render] drawImage() skipped: Image at index ${frameIndex} is not fully loaded or complete.`);
    }
  }

  // Hotspots layout adjustment to perfectly match canvas scale
  const hotspotsOverlay = document.getElementById("hotspots-overlay");
  const canvasContainerOuter = document.getElementById("canvas-container-outer");
  const revealInfoPanel = document.getElementById("reveal-info-panel");
  const breakdownSection = document.getElementById("breakdown");

  function resizeHotspots() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    hotspotsOverlay.style.width = `${rect.width}px`;
    hotspotsOverlay.style.height = `${rect.height}px`;
  }

  window.addEventListener("resize", () => {
    resizeSequenceCanvas();
    resizeHotspots();
    drawFrame();
  });
  ScrollTrigger.addEventListener("refresh", () => {
    resizeSequenceCanvas();
    resizeHotspots();
    drawFrame();
  });

  // Initialize Website after path detection and preloading are complete
  detectImagePath().then(() => preloadSequence()).then(() => {
    // Hide Preloader
    document.querySelector('.preloader').classList.add("hidden");

    // Draw initial closed frame
    drawFrame();

    // Set hotspots layout size
    setTimeout(resizeHotspots, 200);

    // Bind GSAP ScrollTrigger Sequence
    gsap.registerPlugin(ScrollTrigger);

    // Primary Scroll Timeline for Hero & Canvas Sequence
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".sequence-container",
        start: "top top",
        end: "+=300%",
        pin: ".pinned-canvas-wrapper",
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          // Sync global scroll progress bar
          document.querySelector('.scroll-progress-bar').style.width = `${self.progress * 100}%`;
        }
      }
    });

    // Keep the hero overlay hidden until the final frame reveal
    gsap.set(".reveal-info-panel", { opacity: 0, y: 20, pointerEvents: "none" });
    gsap.set("#product-info-below", { opacity: 0, y: 24, pointerEvents: "none" });

    // Play the frame sequence as a continuous scroll scrub
    mainTimeline.to(airtag, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      duration: 1,
      onUpdate: drawFrame,
    }, 0);

    // At near-final progress: shift canvas left slightly and reveal product information below
    mainTimeline.to(canvasContainerOuter, {
      x: '-18vw',
      duration: 0.8,
      ease: 'power2.out'
    }, 0.92);

    mainTimeline.to("#product-info-below", {
      opacity: 1,
      y: 0,
      pointerEvents: "auto",
      duration: 0.8,
      ease: "power2.out",
    }, 0.98);

    // Pinned Hotspot Overlay activation & side text reveal
    ScrollTrigger.create({
      trigger: ".sequence-container",
      start: "bottom bottom",
      end: "+=1",
      onEnter: () => {
        hotspotsOverlay.classList.add("active");
        revealInfoPanel.classList.add("active");
        resizeHotspots();
        if (breakdownSection) breakdownSection.classList.add("visible");
      },
      onLeave: () => {
        hotspotsOverlay.classList.remove("active");
        revealInfoPanel.classList.remove("active");
        closeHotspotCard();
        if (breakdownSection) breakdownSection.classList.remove("visible");
      },
      onEnterBack: () => {
        hotspotsOverlay.classList.add("active");
        revealInfoPanel.classList.add("active");
        resizeHotspots();
        if (breakdownSection) breakdownSection.classList.add("visible");
      },
      onLeaveBack: () => {
        hotspotsOverlay.classList.remove("active");
        revealInfoPanel.classList.remove("active");
        closeHotspotCard();
        if (breakdownSection) breakdownSection.classList.remove("visible");
      }
    });
  });

  // 5. Interactive Hotspot Card details
  const hotspotData = [
    {
      title: "Outer Shell",
      purpose: "Protects internal electronics from impacts, drops, and environmental dust.",
      tech: "Anodized aerospace aluminum casing with high tensile strength.",
      benefit: "Sleek protection without adding noticeable weight."
    },
    {
      title: "Protective Housing",
      purpose: "Creates a sealed interior vault shielding circuits from liquids and shock.",
      tech: "Double-molded reinforced polycarbonate core with silicone gaskets.",
      benefit: "Ensures operational integrity during heavy storms or drops."
    },
    {
      title: "Main PCB",
      purpose: "Coordinates communication, sensor telemetry, and power routing.",
      tech: "Multi-layer high-density interconnect (HDI) gold-plated circuit board.",
      benefit: "Microscopic computing footprint with low resistance."
    },
    {
      title: "Battery",
      purpose: "Provides constant voltage to the wireless sensors.",
      tech: "High-capacity CR2032 lithium-ion coin cell.",
      benefit: "Operates continuously for up to 2 years before standard replacement."
    },
    {
      title: "NFC Module",
      purpose: "Verifies owners and triggers configuration page launch.",
      tech: "High-permeability ferrite coil operating at 13.56 MHz.",
      benefit: "Zero setup software. A single tap binds the device securely."
    },
    {
      title: "Tracking Module",
      purpose: "Beacons encrypted location signals to surrounding mesh systems.",
      tech: "Combined BLE 5.3 & Ultra-Wideband (UWB) transceiver.",
      benefit: "Precision tracking direction vectors accurate to within centimeters."
    },
    {
      title: "Tamper Detection Sensor",
      purpose: "Monitors unauthorized structural entry.",
      tech: "Light-sensitive optical sensor coupled with chassis micro-switches.",
      benefit: "Triggers immediate device alarm if casing is cracked or separated."
    },
    {
      title: "Expandable Frame",
      purpose: "Permits dynamic mechanical expansion to latch onto larger bags.",
      tech: "Spring-loaded stainless steel linkages and slider pins.",
      benefit: "Lays flat inside pockets, then extends to wrap around straps."
    },
    {
      title: "Controller Chip",
      purpose: "Manages encrypted firmware execution and device state decisions.",
      tech: "32-bit ARM Cortex-M4 CPU with integrated hardware secure enclave.",
      benefit: "Ensures cryptographic protection of local signal history."
    },
    {
      title: "Power Core",
      purpose: "Regulates power supply and triggers deep sleep intervals.",
      tech: "Ultra-low quiescent current power management IC (PMIC).",
      benefit: "Minimizes battery usage when the device is static."
    },
    {
      title: "Mounting Rig",
      purpose: "Locks the tracker securely to gear rings, chains, or screw anchors.",
      tech: "High-yield steel carabiner-compatible mount with lock-ring.",
      benefit: "Zero chance of accidental detachment during active movement."
    },
    {
      title: "LED Ring",
      purpose: "Visual confirmation of status, updates, and locate beacon.",
      tech: "RGB Micro-LED system embedded beneath diffusing light ring.",
      benefit: "Easy troubleshooting and night locate tracking."
    }
  ];

  const hsCardContainer = document.getElementById("hotspot-card-container");
  const hsTitle = document.querySelector(".hotspot-card-title");
  const hsPurpose = document.getElementById("hs-purpose");
  const hsTech = document.getElementById("hs-tech");
  const hsBenefit = document.getElementById("hs-benefit");
  const hsClose = document.getElementById("hotspot-card-close");

  document.querySelectorAll(".hotspot").forEach(hotspot => {
    hotspot.addEventListener("click", (e) => {
      const index = parseInt(hotspot.getAttribute("data-index"));
      const data = hotspotData[index];

      if (data) {
        hsTitle.textContent = data.title;
        hsPurpose.textContent = data.purpose;
        hsTech.textContent = data.tech;
        hsBenefit.textContent = data.benefit;

        hsCardContainer.classList.add("active");
      }
    });
  });

  function closeHotspotCard() {
    hsCardContainer.classList.remove("active");
  }
  hsClose.addEventListener("click", closeHotspotCard);

  // 6. Narrative Section Text Reveal
  const problemLines = document.querySelectorAll(".problem-line");
  problemLines.forEach((line) => {
    gsap.fromTo(line,
      { opacity: 0.25 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: line,
          start: "top 75%",
          end: "top 45%",
          scrub: true,
        }
      }
    );
  });

  // 7. Pinned Horizontal "How It Works" Timeline
  const worksTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".works-section",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      pin: true,
    }
  });

  const stepsWrapper = document.querySelector(".timeline-steps");
  worksTimeline.to(stepsWrapper, {
    x: () => -(stepsWrapper.scrollWidth - window.innerWidth + window.innerWidth * 0.25),
    ease: "none"
  }, 0);

  worksTimeline.to(".timeline-progress-fill", {
    width: "100%",
    ease: "none"
  }, 0);

  // Dynamic step node scaling on scroll progress
  const stepNodes = document.querySelectorAll(".timeline-step");
  stepNodes.forEach((node, index) => {
    const startPos = index * (1 / stepNodes.length);
    const endPos = (index + 1) * (1 / stepNodes.length);

    worksTimeline.fromTo(node,
      { scale: 0.95, borderColor: "var(--border-color)", boxShadow: "var(--shadow-soft)" },
      {
        scale: 1.02,
        borderColor: "var(--accent)",
        boxShadow: "var(--shadow-medium)",
        duration: 0.2,
        ease: "power1.out",
        onStart: () => node.classList.add("active"),
        onReverseComplete: () => node.classList.remove("active")
      },
      startPos
    );
  });

  // 8. 3D Tilt Card Interactive Physics
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xc = rect.width / 2;
      const yc = rect.height / 2;

      const angleX = (yc - y) / 12;
      const angleY = (x - xc) / 12;

      gsap.to(card, {
        rotateX: angleX,
        rotateY: angleY,
        translateY: -6,
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.08)",
        duration: 0.3,
        ease: "power2.out"
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        translateY: 0,
        boxShadow: "var(--shadow-soft)",
        duration: 0.5,
        ease: "power2.out"
      });
    });
  });

  // 9. Tamper Detection Simulation Interactive Console
  const btnTamperTrigger = document.getElementById("btn-tamper-trigger");
  const btnTamperReset = document.getElementById("btn-tamper-reset");
  const tamperSimCard = document.querySelector(".tamper-sim-card");
  const dashboardPanel = document.querySelector(".dashboard-panel");
  const sysIntegrity = document.getElementById("sys-integrity");
  const alertStatus = document.getElementById("alert-status");
  const dashboardLogs = document.getElementById("dashboard-logs");

  btnTamperTrigger.addEventListener("click", () => {
    if (tamperSimCard.classList.contains("alert-active")) return; // Prevent spamming

    // Add warning styles
    tamperSimCard.classList.add("alert-active");
    dashboardPanel.classList.add("alert-active");

    // Update dashboard values
    sysIntegrity.textContent = "0% CRITICAL";
    alertStatus.textContent = "COMPROMISED";

    // Append logs
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const log1 = document.createElement("li");
    log1.className = "log-entry log-alert";
    log1.innerHTML = `<span class="log-time">[${timeStr}]</span> WARNING: CASE BREACHED! Mechanical separation detected.`;
    dashboardLogs.appendChild(log1);

    setTimeout(() => {
      const log2 = document.createElement("li");
      log2.className = "log-entry log-alert";
      log2.innerHTML = `<span class="log-time">[${timeStr}]</span> TELEMETRY: Initiating active beacon transmissions...`;
      dashboardLogs.appendChild(log2);
      dashboardLogs.scrollTop = dashboardLogs.scrollHeight;
    }, 800);

    dashboardLogs.scrollTop = dashboardLogs.scrollHeight;
  });

  btnTamperReset.addEventListener("click", () => {
    tamperSimCard.classList.remove("alert-active");
    dashboardPanel.classList.remove("alert-active");

    sysIntegrity.textContent = "100% SECURE";
    alertStatus.textContent = "QUIET";

    // Clear logs back to secure setup
    dashboardLogs.innerHTML = `
      <li class="log-entry log-success"><span class="log-time">[18:05:50]</span> System initialized. Telemetry normal.</li>
      <li class="log-entry log-success"><span class="log-time">[18:05:51]</span> Encrypted handshake verified. Owner present.</li>
    `;
  });

  // 10. NFC Magical Tap Setup Simulator
  const btnSimulateNfc = document.getElementById("btn-simulate-nfc");
  const nfcAnimationBox = document.querySelector(".nfc-animation-box");
  const phoneNfcCard = document.getElementById("phone-nfc-card");
  const phoneNfcStatus = document.getElementById("phone-nfc-status");
  const nfcMiniBar = document.querySelector(".nfc-progress-mini-bar");

  btnSimulateNfc.addEventListener("click", () => {
    // Reset state first
    nfcAnimationBox.className = "nfc-animation-box";
    nfcMiniBar.style.width = "0%";
    phoneNfcStatus.textContent = "Bring closer to pair...";

    // Step 1: Move phone closer
    setTimeout(() => {
      nfcAnimationBox.classList.add("pairing-step-1");
    }, 100);

    // Step 2: Start connection waves
    setTimeout(() => {
      nfcAnimationBox.classList.add("pairing-step-2");
      phoneNfcCard.style.opacity = 1;
      phoneNfcCard.style.transform = "translateY(0)";
      phoneNfcStatus.textContent = "Connecting to LOT...";

      // Animate progress bar
      gsap.to(nfcMiniBar, {
        width: "100%",
        duration: 1.5,
        ease: "power1.inOut"
      });
    }, 900);

    // Step 3: Verified & Ready
    setTimeout(() => {
      nfcAnimationBox.classList.remove("pairing-step-2");
      nfcAnimationBox.classList.add("pairing-step-3");
      phoneNfcStatus.textContent = "Owner Verified. Ready.";
    }, 2500);

    // Auto Reset after demonstration
    setTimeout(() => {
      nfcAnimationBox.className = "nfc-animation-box";
      phoneNfcCard.style.opacity = 0;
      phoneNfcCard.style.transform = "translateY(20px)";
      nfcMiniBar.style.width = "0%";
    }, 6000);
  });

  // 11. GPS Vector Map Live Routing
  const routePath = document.getElementById("route-path-moving");
  const pin = document.getElementById("map-tracker-pin");
  const btnReplayRoute = document.getElementById("btn-replay-route");

  if (routePath && pin) {
    const pathLength = routePath.getTotalLength();

    // Setup initial SVG stroke dashes
    routePath.style.strokeDasharray = pathLength;
    routePath.style.strokeDashoffset = pathLength;

    const mapTelemetry = { progress: 0 };

    function updateMapTracking() {
      const point = routePath.getPointAtLength(mapTelemetry.progress * pathLength);
      pin.setAttribute("transform", `translate(${point.x}, ${point.y})`);

      // Decreasing distance representation
      const distance = Math.round((1 - mapTelemetry.progress) * 82 + 12);
      document.getElementById("tel-distance").textContent = `${distance} meters`;

      // Decreasing Signal telemetry dBm (closer is better, e.g. -35 dBm vs -75 dBm)
      const signal = -70 + Math.round(mapTelemetry.progress * 38);
      document.getElementById("tel-signal").textContent = `${signal} dBm`;

      // Update stroke progress line representation
      routePath.style.strokeDashoffset = pathLength * (1 - mapTelemetry.progress);
    }

    // Start auto loop
    let mapTween = gsap.to(mapTelemetry, {
      progress: 1,
      duration: 10,
      ease: "sine.inOut",
      onUpdate: updateMapTracking,
      repeat: -1,
      yoyo: true
    });

    btnReplayRoute.addEventListener("click", () => {
      mapTween.kill();
      mapTelemetry.progress = 0;
      updateMapTracking();

      mapTween = gsap.to(mapTelemetry, {
        progress: 1,
        duration: 8,
        ease: "power2.inOut",
        onUpdate: updateMapTracking,
        repeat: -1,
        yoyo: true
      });
    });
  }

  // 12. Accordion FAQ transitions
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other active items
      faqItems.forEach(i => {
        i.classList.remove("active");
        i.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

});
