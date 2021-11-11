import { motion } from 'framer-motion'

import Image from 'next/image'
import Link from 'next/link'

function PhaseOneP({
  alert,
  variants,
  handleSubmit,
  currSignupStage,
  fields,
  handleFieldChange,
  isSendingRequest = false
}) {
  let playStoreLink =
    'https://play.google.com/store/apps/details?id=it.clikapp.toduba'
  let appStoreLink = 'https://apps.apple.com/it/app/toduba/id1439451485'
  let huaweiAppGalleryLink = 'https://appgallery.huawei.com/#/app/C102631797'

  return (
    <>
      <motion.div
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          opacity: { duration: 0.5 },
          transform: { duration: 0.5 }
        }}
        className={`flex flex-col rounded-md bg-white ${
          currSignupStage === 5 ? 'h-auto' : 'h-0'
        } w-full max-w-2xl mx-auto shadow-md p-0 ${
          currSignupStage === 5 ? '' : 'p-0'
        }`}
      >
        <div className="p-8 bg-white rounded-md">
          <p className="text-xl font-bold text-center">
            Registrati direttamente sull'app!
          </p>
          <p className="mb-8 text-xl font-bold text-center">
            Sarà semplicissimo
          </p>
          <hr className="w-full pb-8" />
          <h2 className="mb-8 text-2xl text-center text-gray-500">
            Scarica l'app dal tuo store
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center">
            <a
              aria-label="Download on the Google Play Store"
              rel="noopener"
              href={playStoreLink}
              target="_blank"
            >
              <Image
                alt="Google Play Store download badge"
                width="185"
                height="58"
                src="/button_google.svg"
              />
            </a>
            <a
              aria-label="Download on the Apple App Store"
              rel="noopener"
              href={appStoreLink}
              target="_blank"
            >
              <Image
                alt="Apple App Store download badge"
                width="185"
                height="58"
                src="/button_appstore.svg"
              />
            </a>
            <a
              aria-label="Download on the Huawei AppGallery"
              rel="noopener"
              href={huaweiAppGalleryLink}
              target="_blank"
            >
              <Image
                alt="Huawei AppGallery download badge"
                width="185"
                height="58"
                src="/button_huawei.svg"
              />
            </a>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default PhaseOneP
