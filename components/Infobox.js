import Icon, { icons } from './Icon'

function Infobox(props) {
  return (
    <div className="bg-gray-300 p-4 rounded-md border-t-4 border-gray-500 flex items-start gap-2">
      <Icon name={icons.INFO} alt="Info" />
      <div>{props.children}</div>
    </div>
  )
}

export default Infobox
