import type { Metadata } from "next";
import { RepoDetail } from "@/features/repo/RepoDetail";

interface RepoPageProps {
    params: {
        owner: string;
        name: string;
    };
}

export async function generateMetadata({ params }: RepoPageProps): Promise<Metadata> {
    const owner = decodeURIComponent(params.owner);
    const name = decodeURIComponent(params.name);

    return {
        title: `${owner}/${name} · Developer Intelligence`,
        description: `Explore repository statistics, branches, languages, and recent issues for ${owner}/${name}.`,
    };
}

export default function RepoPage({ params }: RepoPageProps) {
    const owner = decodeURIComponent(params.owner);
    const name = decodeURIComponent(params.name);

    return <RepoDetail owner={owner} name={name} />;
}

