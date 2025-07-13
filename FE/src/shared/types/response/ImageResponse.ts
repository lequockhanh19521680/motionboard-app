export type UploadPublicResponse = {
  url: string
}

export type UploadImageResponse = {
  message: string
  key: string
}

export type UploadMultiImageResponse = {
  message: string
  keys: string[]
}

export type GetSignedUrlResponse = {
  signedUrl: string
}
