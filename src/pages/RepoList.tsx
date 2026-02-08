import { Link } from 'react-router-dom'
import { GitBranch, ArrowClockwise, SignOut, GithubLogo, Gear, Triangle } from '@phosphor-icons/react'
import { useRepos, type Repository } from '@/hooks/useRepos'
import { useLogout } from '@/hooks/useAuth'
import { Button } from '@/components/shadcn/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/shadcn/card'

const RepoCard = ({ repo }: { repo: Repository }) => {
    return (
        <Card className="border-(--border) bg-(--card) hover:bg-(--accent)/5 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <GithubLogo className="size-5" />
                        <span className="truncate max-w-[200px]">{repo.repo_name}</span>
                    </CardTitle>
                    <CardDescription>
                        ID: {repo.id.slice(0, 8)}...
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to={`/repos/${repo.id}`} title="Settings">
                            <Gear className="size-5" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
        </Card>
    )
}

export default function RepoList() {
    const { data: repos, isLoading, error, refetch } = useRepos()
    const logout = useLogout()

    return (
        <div className="min-h-screen bg-(--background)">
            {/* Navbar */}
            <header className="border-b border-(--border) bg-(--card)/50 backdrop-blur-sm sticky top-0 z-10 transition-all duration-200">
                <div className="w-full px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-(--primary) flex items-center justify-center text-(--primary-foreground)">
                            <Triangle weight="fill" className="size-5" />
                        </div>
                        <span className="font-bold text-lg">Delta</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => refetch()} title="Refresh">
                            <ArrowClockwise className={`size-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => logout.mutate()} title="Sign out">
                            <SignOut className="size-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-0 px-12 py-8 max-w-7xl animate-in fade-in duration-500">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Repositories</h1>
                    <p className="text-(--muted-foreground)">
                        Select a repository to manage automation settings.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 rounded-xl border border-(--border) bg-(--card) animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-(--destructive)">
                        <p>Error loading repositories. Please try again.</p>
                        <Button variant="outline" className="mt-4" onClick={() => refetch()}>Retry</Button>
                    </div>
                ) : repos?.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-(--border) rounded-xl">
                        <GitBranch className="size-12 mx-auto text-(--muted-foreground) mb-4" />
                        <h3 className="text-lg font-medium">No repositories linked</h3>
                        <p className="text-(--muted-foreground) mb-6">
                            Connect the GitHub App to get started.
                        </p>
                        <Button asChild>
                            <a href="https://github.com/apps/YOUR_APP_NAME" target="_blank" rel="noreferrer">
                                Install App
                            </a>
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {repos?.map(repo => (
                            <RepoCard key={repo.id} repo={repo} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
