import { useEffect, useState } from "react";

export const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          setActive((current) => {
            if (isIntersecting) return target.id;
            return current === target.id ? null : current;
          });
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
};
