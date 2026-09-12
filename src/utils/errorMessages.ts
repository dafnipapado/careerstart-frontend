const errorMessages: Record<string, string> = {
    "UserNotFound": "Could not find requested user.",
    "UserPasswordInvalidCredentials": "Wrong password!",
    "EmployerNotFound": "Employer could not be found.",
    "JobSeekerNotFound": "Job seeker could not be found.",
    "JobListingNotFound": "The job listing you're looking for could not be found.",
    "AttachmentPictureNotFound": "Picture could not be found.",
    "AttachmentCVNotFound": "CV could not be found.",
    "RoleNotFound": "No users found with the specified role.",
    "ProfessionalFieldNotFound": "The selected industry is no longer available.",
    "RegionNotFound": "The selected region is no longer available.",
    "JobSeekerCvNotFound": "No CV has been posted for this job seeker.",

    "UserUsernameAlreadyExists": "A user with this username already exists.",
    "UserEmailAlreadyExists": "A user with this email already exists.",
    "EmployerVatAlreadyExists": "An employer with this VAT already exists.",
    "JobSeekerJobListingApplyAlreadyExists": "You have already applied for this position!",
    "JobSeekerJobListingWithdrawAlreadyExists": "You have already withdrawn from this position!",

    "UserInvalidData": "There was something wrong with your user input data. Please try again.",
    "EmployerInvalidData": "There was something wrong with your employer input data. Please try again.",
    "JobSeekerInvalidData": "There was something wrong with your job seeker input data. Please try again.",
    "JobListingInvalidData": "There was something wrong with your job listing input data. Please try again.",
    "JobSeekerCvInvalidData": "There was something wrong with your CV input data. Please try again.",

    "EmptyFile": "Please select a file before uploading.",
    "UnsupportedFileType": "This file type is not supported. Try uploading a different one.",
    "FileUpload": "An error occurred during upload. Please, try again.",
    "FileRead": "Could not read file. Try again later.",

    "NOT_FOUND": "We can't find this page. It may have been moved or deleted.",
    "INVALID_CREDENTIALS": "Wrong username or password. Please, try again.",
    "ACCOUNT_DISABLED": "Your account has been disabled.",
    "ACCOUNT_LOCKED": "Your account has been locked.",
    "EXPIRED_CREDENTIALS": "Your credentials have expired. Please log in again.",
    "INSUFFICIENT_AUTHENTICATION": "You need to log in first.",
    "ACCESS_DENIED": "You don't have permission for this action.",
    "EXPIRED_TOKEN": "Your session has expired. Please log in again.",
    "AUTHENTICATION_ERROR": "Authentication failed. Please log in again.",
    "BAD_REQUEST": "We cannot understand your request. Please check your link or refresh the page and try again.",
    "CONFLICT": "Conflict due to existing data. Please refresh and try again.",
    "INTERNAL_SERVER_ERROR": "Something went wrong on our end. Please, try again later."
}

export function getErrorMessage(code: string) : string {
    return errorMessages[code] ?? "Something went wrong."
}