import {useEffect, useState} from "react";
import * as React from "react";
import {toast} from "sonner";
import type {ErrorResponse} from "@/schemas/error.ts";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SquarePen} from "lucide-react";
import defaultUserPicture from "@/assets/images/default-user-picture.png";

const PictureUpload = ({
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

    useEffect(() => {
        onGetPicture(uuid)
            .then(blob => {
                setAvatarUrl(URL.createObjectURL(blob))
                setHasAvatar(true)
            })
            .catch(() => setHasAvatar(false))
    }, [])

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
            toast.success("Avatar was uploaded successfully!")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
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
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={() => {if (selectedFile) handleUpload(uuid, selectedFile)}}>
                            <input type="file" id="avatar" className="hidden" onChange={handleFileChange} />
                            <label htmlFor="avatar" className="text-white px-4 py-2 rounded-sm bg-font-dark-purple hover:bg-hover-dark-purple cursor-pointer">
                                Upload
                            </label>
                            <span>{selectedFilename}</span>
                            <button type="submit" className="bg-red-400 cursor-pointer">Save</button>
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

export default PictureUpload