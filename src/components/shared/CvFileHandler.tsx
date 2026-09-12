import {useEffect, useState} from "react";
import * as React from "react";
import {toast} from "sonner";
import type {ErrorResponse} from "@/schemas/error.ts";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Upload} from "lucide-react";
import CustomButton from "@/components/shared/CustomButton.tsx";
import {getErrorMessage} from "@/utils/errorMessages.ts";

const CvFileHandler = ({
    uuid,
    onUpload,
    onGetCv,
    canUpload
   } : {
    uuid: string,
    onUpload: (uuid: string, file: File) => Promise<void>,
    onGetCv: (uuid: string) => Promise<{filename: string | null, blob: Blob}>,
    canUpload: boolean
    }) => {

    const [hasCvFile, setHasCvFile] = useState<boolean>(false)
    const [cvUrl, setCvUrl] = useState<string>("")
    const [open, setOpen] = React.useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedFilename, setSelectedFilename] = useState<string>("")
    const [filename, setFilename] = useState<string>("")
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {

        onGetCv(uuid)
            .then(({filename, blob}) => {
                setCvUrl(URL.createObjectURL(blob))
                setFilename(filename ?? "")
                setHasCvFile(true)
            })
            .catch(() => setHasCvFile(false))
    }, [refresh, onGetCv, uuid])

    const cv = hasCvFile
        ?
        <div className="absolute mt-51 ml-3 text-lg">
            <span className="font-medium">Download CV:</span>
            <a href={cvUrl} target="_blank" className="text-font-link-blue hover:text-blue-800 hover:underline figtree-custom-italics mt-0.5 ml-3">
                {filename}
            </a>
        </div>
        : <div></div>

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
            <div>
                {cv}
                {canUpload && (
                <div>
                <Dialog open={open} onOpenChange={(isOpen) => {setOpen(isOpen)
                    if (!isOpen) setSelectedFilename("")}}>
                    <DialogTrigger>
                        <Button variant="outline" className={`${hasCvFile ? "right-118" : "right-90"} top-142 absolute px-4 py-2 rounded-sm border border-primary-dark-purple text-primary-dark-purple cursor-pointer hover:bg-gray-200 hover:text-primary-dark-purple`}>
                            <Upload />Upload CV
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-106.25 h-50">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            if (selectedFile) handleUpload(uuid, selectedFile)}
                        }
                              className="h-30 p-7 flex flex-col gap-3">
                            <div className="flex justify-between gap-4">
                                <input type="file" id="avatar" className="hidden" onChange={handleFileChange} />
                                <label htmlFor="avatar" className="w-1/4 text-primary-dark-purple px-4 py-2 rounded-sm border border-primary-dark-purple hover:bg-gray-300 cursor-pointer">
                                    Upload
                                </label>
                                <span className="w-5/6 border border-gray-300 rounded-sm text-center content-center">{selectedFilename}</span>
                            </div>
                            <div className="figtree-custom-italics text-xs text-end -mt-2 mb-2">(.pdf, .doc)</div>
                            <CustomButton label="Save" type="submit" addClasses={`block mx-auto ${!selectedFilename ? "bg-gray-400! border-gray-400!" : ""}`} disabled={!selectedFilename}></CustomButton>
                        </form>
                    </DialogContent>
                </Dialog>
                </div>
                )}
            </div>

        </>
    )
}

export default CvFileHandler