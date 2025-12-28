import { useEffect, useRef } from "react";
import Lenis from "lenis";
import AllRoute from "../router";
import ErrorBoundaryWrapper from "./ErrorBoundaryWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import AnimationManager from "../../utils/animationCleanup";

gsap.registerPlugin(SplitText, ScrollTrigger);

const App: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const splitInstancesRef = useRef<Map<string, any>>(new Map());

  // Lenis Smooth Scroll
  useEffect(() => {
    if (lenisRef.current) {
      console.debug('[Lenis] Instance already initialized');
      return;
    }

    try {
      const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
      });

      lenisRef.current = lenis;

      const raf = (time: number) => {
        if (lenisRef.current) {
          lenisRef.current.raf(time);
          animationFrameRef.current = requestAnimationFrame(raf);
        }
      };

      animationFrameRef.current = requestAnimationFrame(raf);

      console.debug('[Lenis] Initialization complete');

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (lenisRef.current) {
          lenisRef.current.destroy();
          lenisRef.current = null;
        }
        console.debug('[Lenis] Cleanup complete');
      };
    } catch (error) {
      console.error('[Lenis] Initialization failed:', error);
    }
  }, []);

  // SplitText Reveal Animation
  useEffect(() => {
    const applySplitTextReveal = () => {
      const elements = document.querySelectorAll<HTMLElement>(".xb-text-reveal");
      if (!elements.length) return;

      elements.forEach((el, index) => {
        if (el.dataset.splitApplied === "true") return;

        const splitId = `split-${index}-${Date.now()}`;
        el.dataset.splitApplied = "true";
        el.dataset.splitId = splitId;

        try {
          const split = new SplitText(el, {
            type: "lines,words,chars",
            linesClass: "split-line",
          });

          splitInstancesRef.current.set(splitId, split);
          AnimationManager.registerSplitInstance(splitId, split);

          gsap.set(split.chars, { opacity: 0.3, x: -7 });

          const tween = gsap.to(split.chars, {
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 60%",
              scrub: 1,
              markers: false,
            },
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: "power2.out",
          });

          AnimationManager.trackTween(tween);

          console.debug(`[Animation] SplitText applied to ${splitId}`);
        } catch (error) {
          console.warn("[Animation] SplitText failed:", error);
        }
      });
    };

    const timeout = setTimeout(applySplitTextReveal, 400);

    observerRef.current = new MutationObserver(() => {
      requestAnimationFrame(applySplitTextReveal);
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    console.debug('[Animation] Observer started');

    return () => {
      clearTimeout(timeout);

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      ScrollTrigger.getAll().forEach((st) => {
        try {
          st.kill();
        } catch (error) {
          console.warn('[ScrollTrigger] Kill error:', error);
        }
      });

      try {
        gsap.killTweensOf('.xb-text-reveal *');
      } catch (error) {
        console.warn('[GSAP] killTweensOf error:', error);
      }

      splitInstancesRef.current.forEach((instance, id) => {
        try {
          if (instance && typeof instance.revert === 'function') {
            instance.revert();
          }
        } catch (error) {
          console.warn(`[SplitText] Revert error for ${id}:`, error);
        }
      });
      splitInstancesRef.current.clear();

      AnimationManager.reset();

      console.debug('[Animation] Cleanup complete');
    };
  }, []);

  return (
    <div className="App lenis" id="scrool">
      <ErrorBoundaryWrapper>
        <AllRoute />
      </ErrorBoundaryWrapper>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
