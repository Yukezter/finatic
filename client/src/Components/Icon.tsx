import React, { useEffect, useState } from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  title: string
}

const Icon = (props: IconProps) => {
  const { name, title, height = 32, color = 'inherit' } = props
  const [Component, setIconModule] = useState<React.FC<IconProps> | null>(null)

  useEffect(() => {
    import(`!!@svgr/webpack?-svgo,+titleProp,+ref!../Assets/Svg/${name}.svg`)
      .then(module => {
        setIconModule(module.default)
      })
      .catch(() => {
        console.error(`Icon with name: ${name} not found!`)
      })
  }, [name])

  if (!Component) return null
  return (
    <Component
      title={title}
      height={height}
      color={color}
      fill='currentColor'
      display='block'
    />
  )
}

export default Icon
