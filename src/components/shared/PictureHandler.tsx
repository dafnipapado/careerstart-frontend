import {useEffect, useState} from "react";
import * as React from "react";
import {toast} from "sonner";
import type {ErrorResponse} from "@/schemas/error.ts";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SquarePen} from "lucide-react";
import defaultUserPicture from "@/assets/images/default-user-picture.png";
import CustomButton from "@/components/shared/CustomButton.tsx";
import {getErrorMessage} from "@/utils/errorMessages.ts";

const PictureHandler = ({
    uuid,
    onUpload,
    onGetPicture,
    canUpload
   } : {
    uuid: string,
    onUpload: (uuid: string, file: File) => Promise<void>,
    onGetPicture: (uuid: string) => Promise<Blob>,
    canUpload: boolean
    }) => {

    const [hasAvatar, setHasAvatar] = useState<boolean>(false)
    const [avatarUrl, setAvatarUrl] = useState<string>("")
    const [open, setOpen] = React.useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedFilename, setSelectedFilename] = useState<string>("")
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        onGetPicture(uuid)
            .then(blob => {
                setAvatarUrl(URL.createObjectURL(blob))
                setHasAvatar(true)
            })
            .catch(() => setHasAvatar(false))
    }, [refresh, onGetPicture, uuid])

    const picture = hasAvatar
    ? <img className="w-40 h-40 rounded-3xl group-hover:opacity-95 "
           src={avatarUrl} alt="user picture"/>
    : <img className="w-40 h-40 rounded-3xl group-hover:opacity-95"
           src={defaultUserPicture} alt="user picture"/>

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setSelectedFile(file ?? null)
        setSelectedFilename(file?.name ?? "")
    }

    const handleUpload = async (uuid: string, file: File) => {
        try {
            await onUpload(uuid, file)
            setRefresh(prev => !prev)
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    return (
        <>
            {canUpload
            ?
            <div>
                <Dialog open={open} onOpenChange={(isOpen) => {setOpen(isOpen)
                    if (!isOpen) setSelectedFilename("")}}>
                    <DialogTrigger>
                        <Button variant="outline" className="absolute w-40 h-40 rounded-3xl left-15 -bottom-20 cursor-pointer">
                            <div className="group absolute w-40 h-40 rounded-3xl">
                                {picture}
                                <SquarePen className="relative w-10! h-10! text-gray-900 opacity-0 group-hover:opacity-100 left-15 bottom-25 z-50 duration-300 ease-in-out zoom-[0.98]" />
                            </div>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-106.25 h-50 bg-surface">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            if (selectedFile) handleUpload(uuid, selectedFile)}
                          }
                              className="h-30 p-7 flex flex-col gap-3">
                            <div className="flex justify-between gap-4">
                                <input type="file" id="avatar" className="hidden" onChange={handleFileChange} />
                                <label htmlFor="avatar" className="w-1/4 px-4 py-2 rounded-sm border border-primary-dark-purple bg-secondary-light-purple text-surface hover:bg-secondary-light-purple/80 hover:text-font cursor-pointer">
                                    Upload
                                </label>
                                <span className="w-5/6 border border-gray-300 bg-font/80 rounded-sm text-center content-center">{selectedFilename}</span>
                            </div>
                            <div className="figtree-custom-italics text-xs text-end -mt-2 mb-2 text-font">(.jpeg, .jpg, .png)</div>
                            <CustomButton label="Save" type="submit" addClasses={`block mx-auto ${!selectedFilename ? "bg-gray-400! border-gray-400!" : ""}`} disabled={!selectedFilename}></CustomButton>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            :
            <div className="absolute w-40 h-40 left-15 -bottom-20 rounded-3xl hover:opacity-100!">
                {picture}
            </div>
            }
        </>
    )
}

export default PictureHandler