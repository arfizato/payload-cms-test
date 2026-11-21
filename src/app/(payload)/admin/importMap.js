import { PublishStatus as PublishStatus_9d899df7309198a3984325b7d31ed24e } from '@/components/admin/PublishStatus'
import { PageNav as PageNav_a18b88d6759326522ad2eb0674239118 } from '@/components/admin/PageNav'
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from '@payloadcms/storage-s3/client'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

/** @type import('payload').ImportMap */
export const importMap = {
  "@/components/admin/PublishStatus#PublishStatus": PublishStatus_9d899df7309198a3984325b7d31ed24e,
  "@/components/admin/PageNav#PageNav": PageNav_a18b88d6759326522ad2eb0674239118,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
