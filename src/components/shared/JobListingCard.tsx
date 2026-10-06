import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {statusStyle} from "@/components/shared/statusStyle.ts";
import {statusIcon} from "@/components/shared/statusIcon.tsx";
import {BadgeCheck, CalendarFold, Dot, Factory, MapPin} from "lucide-react";
import {Link} from "react-router";
import CustomButton from "@/components/shared/CustomButton.tsx";
import type {JobListingReadSummary} from "@/schemas/jobListing.ts";
import * as React from "react";

const JobListingCard = ({
    role,
    jobListing,
    hasApplied,
    children
} : {
    role: string | null,
    jobListing: JobListingReadSummary,
    hasApplied: boolean,
    children?: React.ReactNode
}) => {

    return (
        <>
            <Card key={jobListing.uuid} className="flex flex-col w-full h-50 bg-surface shadow-xl container-shadow mx-auto mb-10 p-5 ">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-5">
                        <div key={jobListing.title}>
                            {jobListing.title}
                        </div>
                        {children}
                        {hasApplied && (
                            <div className="flex bg-success text-text-light text-xs figtree-custom-italics rounded-sm p-1 h-5 items-center gap-1">
                                <BadgeCheck size={16}/>
                                <p>applied</p>
                            </div>
                        )}
                    </CardTitle>
                    <CardDescription className={`${statusStyle(jobListing.status)} text-text-light text-md font-semibold rounded-sm p-1 h-8`}>
                        <div key={jobListing.status} className="flex gap-1 px-1">
                            <span>{statusIcon(jobListing.status)}</span> {jobListing.status}
                        </div>
                    </CardDescription>
                </CardHeader>
                <div className="flex flex-col text-base font-sans">
                    <div className="self-start figtree-custom-italics text-industry text-sm ml-7 -mt-5" key={jobListing.professionalFieldName}>
                        {jobListing.professionalFieldName}
                    </div>
                    <div className="flex items-baseline gap-1 ml-5 mt-3 text-sm font-medium">
                            <span className="flex gap-1">
                                <MapPin strokeWidth={1.25} size={20}  />
                                <div key={jobListing.regionName}>
                                    {jobListing.regionName}
                                </div>
                            </span>

                        <Dot/>
                        <span className="flex gap-1">
                            <Factory strokeWidth={1.25} size={20}/>
                            {role === "JOB_SEEKER"
                                ?
                                <Link to={`/job_seeker/employer/${jobListing.employerUuid}`}>
                                    <div key={jobListing.employerBrandName}>
                                        {jobListing.employerBrandName}
                                    </div>
                                </Link>
                                :
                                <div key={jobListing.employerBrandName}>
                                    {jobListing.employerBrandName}
                                </div>
                            }
                        </span>
                        <Dot/>
                        <span className="flex gap-1">
                            <CalendarFold strokeWidth={1.25} size={20} />
                            <div key={jobListing.dateCreated.slice(0,10)}>
                            {jobListing.dateCreated.slice(0,10)}
                            </div>
                        </span>
                    </div>
                </div>
                <CardFooter className="w-full mt-auto text-primary-dark-purple">
                    <Link to={`/job-listings/${jobListing.uuid}`} className="w-full">
                        <CustomButton label="View Listing ⟶" addClasses="w-full"></CustomButton>
                    </Link>
                </CardFooter>
            </Card>
        </>
    )
}

export default JobListingCard