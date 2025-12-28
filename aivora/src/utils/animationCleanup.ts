import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class AnimationManager {
  private static splitInstances: Map<string, any> = new Map();
  private static tweens: gsap.core.Tween[] = [];

  static registerSplitInstance(id: string, instance: any): void {
    this.splitInstances.set(id, instance);
  }

  static trackTween(tween: gsap.core.Tween): void {
    this.tweens.push(tween);
  }

  static killAllAnimations(): void {
    this.tweens.forEach((tween) => {
      try {
        tween.kill();
      } catch (error) {
        console.warn('Error killing tween:', error);
      }
    });
    this.tweens = [];

    ScrollTrigger.getAll().forEach((trigger) => {
      try {
        trigger.kill();
      } catch (error) {
        console.warn('Error killing ScrollTrigger:', error);
      }
    });

    this.splitInstances.forEach((instance, id) => {
      try {
        if (instance && typeof instance.revert === 'function') {
          instance.revert();
        }
      } catch (error) {
        console.warn(`Error killing SplitText instance ${id}:`, error);
      }
    });
    this.splitInstances.clear();

    try {
      gsap.killTweensOf('.xb-text-reveal *');
    } catch (error) {
      console.warn('Error killing tweens of selector:', error);
    }
  }

  static reset(): void {
    this.killAllAnimations();
  }

  static getStats() {
    return {
      activeTweens: this.tweens.length,
      activeScrollTriggers: ScrollTrigger.getAll().length,
      splitInstances: this.splitInstances.size,
    };
  }
}

export default AnimationManager;