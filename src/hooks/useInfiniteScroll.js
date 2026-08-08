import { useEffect } from "react";

function useInfiniteScroll({
  targetRef,
  onIntersect,
  enabled = true,
  rootMargin = "300px",
}) {
  useEffect(() => {
    const target = targetRef.current;

    if (!target || !enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (
          firstEntry.isIntersecting
        ) {
          onIntersect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [
    targetRef,
    onIntersect,
    enabled,
    rootMargin,
  ]);
}

export default useInfiniteScroll;