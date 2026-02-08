import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, GithubLogo, FloppyDisk } from '@phosphor-icons/react'
import { useRepos, useUpdateRepoSettings, useToggleRepo } from '@/hooks/useRepos'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
// Switch component generic replacement used inline
import { Badge } from '@/components/shadcn/badge'
import { Separator } from '@/components/shadcn/separator'

export default function RepoSettings() {
    const { repoId } = useParams()
    const navigate = useNavigate()
    const { data: repos, isLoading: isLoadingRepos } = useRepos()
    const updateSettings = useUpdateRepoSettings()
    const toggleRepo = useToggleRepo()

    const repo = repos?.find(r => r.id === repoId)

    const [docsPath, setDocsPath] = useState('')
    const [defaultBranch, setDefaultBranch] = useState('')
    const [driftSensitivity, setDriftSensitivity] = useState(0.5)
    const [stylePreference, setStylePreference] = useState('professional')

    // Load initial state when repo is found
    useEffect(() => {
        if (repo) {
            setDocsPath(repo.docs_root_path || '/docs')
            setDefaultBranch(repo.target_branch || 'main')
            setDriftSensitivity(repo.drift_sensitivity || 0.5)
            setStylePreference(repo.style_preference || 'professional')
        }
    }, [repo])

    if (isLoadingRepos) {
        return <div className="p-8 text-center text-(--muted-foreground)">Loading repository details...</div>
    }

    if (!repo) {
        return <div className="p-8 text-center text-(--destructive)">Repository not found.</div>
    }

    const handleSave = () => {
        updateSettings.mutate({
            id: repo.id,
            settings: {
                docs_root_path: docsPath,
                target_branch: defaultBranch,
                drift_sensitivity: Number(driftSensitivity),
                style_preference: stylePreference
            }
        })
    }

    const handleToggleActive = (isActive: boolean) => {
        toggleRepo.mutate({ id: repo.id, is_active: isActive })
    }

    return (
        <div className="min-h-screen bg-(--background) pb-20">
            {/* Header */}
            <header className="border-b border-(--border) bg-(--card)/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/repos')}>
                            <ArrowLeft className="size-5" />
                        </Button>
                        <div>
                            <h1 className="font-bold text-lg flex items-center gap-2">
                                {repo.repo_name}
                                <Badge variant={repo.is_active ? "default" : "secondary"} className={repo.is_active ? "bg-green-500/15 text-green-600 hover:bg-green-500/25" : ""}>
                                    {repo.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </h1>
                            <p className="text-xs text-(--muted-foreground) font-mono">{repo.id}</p>
                        </div>
                    </div>

                    <Button asChild variant="outline" size="sm">
                        <a href={`https://github.com/${repo.repo_name}`} target="_blank" rel="noreferrer">
                            <GithubLogo className="size-4 mr-2" />
                            View on GitHub
                        </a>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">

                {/* Activation Section */}
                <section>
                    <Card className="border-(--border) shadow-sm">
                        <CardHeader>
                            <CardTitle>Monitoring Status</CardTitle>
                            <CardDescription>Enable or disable automated monitoring for this repository.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="active-toggle" className="text-base font-medium">Enable Monitoring</Label>
                                <p className="text-sm text-(--muted-foreground)">
                                    {repo.is_active
                                        ? "Delta is actively monitoring this repository for drift."
                                        : "Monitoring is paused. No updates will be processed."}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {toggleRepo.isPending && <span className="text-xs text-(--muted-foreground) animate-pulse">Updating...</span>}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        id="active-toggle"
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={repo.is_active}
                                        onChange={(e) => handleToggleActive(e.target.checked)}
                                        disabled={toggleRepo.isPending}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Settings Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">Documentation Automation</h2>
                        <p className="text-sm text-(--muted-foreground)">Configure how Delta generates and manages your documentation.</p>
                    </div>

                    <Card className="border-(--border) shadow-sm">
                        <CardContent className="space-y-6 pt-6">

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="docs-path">Documentation Path</Label>
                                    <Input
                                        id="docs-path"
                                        value={docsPath}
                                        onChange={(e) => setDocsPath(e.target.value)}
                                        placeholder="/docs"
                                    />
                                    <p className="text-[10px] text-(--muted-foreground)">Where documentation lives in your repo.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="default-branch">Default Branch</Label>
                                    <Input
                                        id="default-branch"
                                        value={defaultBranch}
                                        onChange={(e) => setDefaultBranch(e.target.value)}
                                        placeholder="main"
                                    />
                                    <p className="text-[10px] text-(--muted-foreground)">Branch to target for PRs.</p>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="drift-sensitivity">Drift Sensitivity</Label>
                                    <select
                                        id="drift-sensitivity"
                                        className="flex h-9 w-full rounded-md border border-(--input) bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-(--muted-foreground) focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-(--ring) disabled:cursor-not-allowed disabled:opacity-50"
                                        value={driftSensitivity}
                                        onChange={(e) => setDriftSensitivity(Number(e.target.value))}
                                    >
                                        <option value={0.1}>Low (0.1) - Major changes only</option>
                                        <option value={0.5}>Medium (0.5) - Balanced</option>
                                        <option value={0.9}>High (0.9) - Strict</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="style-preference">Style Preference</Label>
                                    <select
                                        id="style-preference"
                                        className="flex h-9 w-full rounded-md border border-(--input) bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-(--muted-foreground) focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-(--ring) disabled:cursor-not-allowed disabled:opacity-50"
                                        value={stylePreference}
                                        onChange={(e) => setStylePreference(e.target.value)}
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="concise">Concise</option>
                                        <option value="tutorial">Tutorial</option>
                                        <option value="api-first">API-First</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleSave}
                                    disabled={updateSettings.isPending}
                                    className="min-w-[120px]"
                                >
                                    {updateSettings.isPending ? (
                                        <>Saving...</>
                                    ) : (
                                        <>
                                            <FloppyDisk className="mr-2 size-4" />
                                            Save Settings
                                        </>
                                    )}
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    )
}
