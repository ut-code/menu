import { useAnimation } from "framer-motion"

interface Props {
  controls: ReturnType<typeof useAnimation>
}

export default function FadeIn(props: Props = { controls: useAnimation() }) {
  props.controls.stop()
  props.controls.set({ opacity: 0 })
  props.controls.start({
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  })
}
