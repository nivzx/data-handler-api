const CryptoJS = require('crypto-js')
// const base64 = require('base64-js')

exports.decrypt = function (encryptedData) {
  // Original encryption key (16 bytes)
  const encryptionKey = 'ASDFGHJKLASDFGHJ' // Hard-coded for simplicity

  // Convert the base64-encoded encrypted data to a WordArray
  const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedData)

  // Decrypt the data using AES-256-ECB
  const decryptedWordArray = CryptoJS.AES.decrypt(
    { ciphertext: encryptedWordArray },
    CryptoJS.enc.Utf8.parse(encryptionKey), // Convert the key to a WordArray
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  )

  // Convert the decrypted WordArray to a UTF-8 string
  const decryptedText = decryptedWordArray.toString(CryptoJS.enc.Utf8)

  return decryptedText
}
