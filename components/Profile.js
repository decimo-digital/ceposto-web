import { scopeDescriptions } from 'utils/enums'

function Profile({ selected, onClick, scope }) {
  return (
    <div
      className={`${
        selected ? 'border-green-500 border-2 ' : 'border-gray-300 border'
      } hover:bg-gray-100 p-4 flex flex-col items-center gap-4 cursor-pointer rounded-md`}
      onClick={onClick}
    >
      <img
        src={`/registration/${scope}.svg`}
        className="h-24 w-24"
        alt={scopeDescriptions[scope]}
      />
      <p
        className={`${selected ? 'font-bold text-green-500' : 'text-gray-700'}`}
      >
        {scopeDescriptions[scope]}
      </p>
    </div>
  )
}

export default Profile
