import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_COMMENT, ADD_THEORY, LOGIN, THEORIES } from './graphql';
import { clsx } from 'clsx';

export type Status = 'UNVERIFIED' | 'DEBUNKED' | 'CONFIRMED';

interface User {
  id: string;
  username: string;
}

interface AuthPayload {
  token: string;
  user: User;
}

interface Comment {
  id: string;
  content: string;
  postedAt: string;
  displayAuthor: string;
  anonymous: boolean;
  author: User;
}

interface Theory {
  id: string;
  title: string;
  content: string;
  status: Status;
  postedAt: string;
  evidenceUrls: string[];
  commentCount: number;
  displayAuthor: string;
  anonymous: boolean;
  author: User;
  comments: Comment[];
}

interface TheoryPage {
  content: Theory[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

const statusColors: Record<Status, string> = {
  UNVERIFIED: 'bg-yellow-900/40 text-amber-200 border-amber-400/50',
  DEBUNKED: 'bg-red-900/40 text-red-200 border-red-400/50',
  CONFIRMED: 'bg-green-900/40 text-emerald-200 border-emerald-400/50',
};

const formatDate = (value: string) => new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

function App() {
  const [filters, setFilters] = useState({ keyword: '', status: '' as Status | '', hot: true, page: 0 });
  const [loginState, setLoginState] = useState<{ username: string; secretCode: string }>({ username: 'Mulder', secretCode: 'TRUSTNO1' });
  const [session, setSession] = useState<AuthPayload | null>(null);
  const [newTheory, setNewTheory] = useState({ title: '', content: '', evidenceUrls: '', anonymous: false, status: 'UNVERIFIED' as Status });
  const [activeTheory, setActiveTheory] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<{ theories: TheoryPage }>(THEORIES, {
    variables: { page: filters.page, status: filters.status || null, keyword: filters.keyword || null, hot: filters.hot },
    fetchPolicy: 'cache-and-network',
  });

  const [login, { loading: loggingIn, error: loginError }] = useMutation<{ login: AuthPayload }>(LOGIN, {
    onCompleted: (payload) => setSession(payload.login),
  });

  const [addTheory, { loading: addingTheory, error: addTheoryError }] = useMutation<{ addTheory: Pick<Theory, 'id'> }>(ADD_THEORY, {
    onCompleted: () => {
      setNewTheory({ title: '', content: '', evidenceUrls: '', anonymous: false, status: 'UNVERIFIED' });
      refetch();
    },
  });

  const [addComment] = useMutation<{ addComment: Comment }>(ADD_COMMENT, {
    onCompleted: () => refetch(),
  });

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ variables: { ...loginState } });
  };

  const handleNewTheory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    addTheory({
      variables: {
        input: {
          title: newTheory.title,
          content: newTheory.content,
          status: newTheory.status,
          userId: session.user.id,
          evidenceUrls: newTheory.evidenceUrls.split(/\n|,/).map((link) => link.trim()).filter(Boolean),
          anonymous: newTheory.anonymous,
        },
      },
    });
  };

  const theories = data?.theories.content ?? [];
  const active = useMemo(() => theories.find((theory) => theory.id === activeTheory) ?? theories[0], [theories, activeTheory]);

  const submitComment = (event: FormEvent<HTMLFormElement>, theoryId: string) => {
    event.preventDefault();
    if (!session) return;
    const form = new FormData(event.currentTarget);
    const content = (form.get('content') as string) ?? '';
    const anonymous = Boolean(form.get('anonymous'));
    if (!content.trim()) return;
    addComment({ variables: { input: { theoryId, content, userId: session.user.id, anonymous } } });
    event.currentTarget.reset();
  };

  return (
    <div className="min-h-screen">
      <header className="px-6 py-4 border-b border-accent/30 flex items-center justify-between backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-sand/70">Mystery node</p>
          <h1 className="text-2xl font-semibold text-neon">Conspiracy Pulse</h1>
        </div>
        <div className="flex items-center gap-3">
          {session ? (
            <div className="text-right">
              <p className="text-sm text-sand/80">Signed in as</p>
              <p className="font-semibold">{session.user.username}</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex gap-2 text-sm items-end">
              <div>
                <label className="block text-sand/70">Codename</label>
                <input className="bg-mist border border-accent/40 rounded px-3 py-1.5" value={loginState.username} onChange={(e) => setLoginState({ ...loginState, username: e.target.value })} />
              </div>
              <div>
                <label className="block text-sand/70">Secret code</label>
                <input className="bg-mist border border-accent/40 rounded px-3 py-1.5" value={loginState.secretCode} onChange={(e) => setLoginState({ ...loginState, secretCode: e.target.value })} />
              </div>
              <button type="submit" className="h-10 px-4 rounded bg-neon text-midnight font-semibold" disabled={loggingIn}>{loggingIn ? 'Authenticating...' : 'Enter'}</button>
            </form>
          )}
        </div>
      </header>

      {loginError && <div className="bg-red-900/40 border border-red-500/40 text-red-100 px-6 py-3">{loginError.message}</div>}

      <main className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
        <section className="xl:col-span-2 space-y-4">
          <div className="glow-card rounded-lg p-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs uppercase text-sand/70">Keyword</label>
                <input value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value, page: 0 })} className="w-full bg-mist/60 border border-accent/40 rounded px-3 py-2" placeholder="Secret societies, lights in the sky..." />
              </div>
              <div>
                <label className="block text-xs uppercase text-sand/70">Status</label>
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as Status | '', page: 0 })} className="bg-mist/60 border border-accent/40 rounded px-3 py-2">
                  <option value="">Any</option>
                  <option value="UNVERIFIED">Unverified</option>
                  <option value="DEBUNKED">Debunked</option>
                  <option value="CONFIRMED">Confirmed</option>
                </select>
              </div>
              <label className="inline-flex items-center gap-2 text-sand/80 cursor-pointer select-none">
                <input type="checkbox" checked={filters.hot} onChange={(e) => setFilters({ ...filters, hot: e.target.checked })} className="accent-neon" /> Hot first
              </label>
              <div className="ml-auto text-sm text-sand/70">Page {filters.page + 1} / {data?.theories.totalPages ?? 1}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {loading && <div className="col-span-2 text-center text-sand/60">Scanning theories...</div>}
            {theories.map((theory) => (
              <article
                key={theory.id}
                onClick={() => setActiveTheory(theory.id)}
                className={clsx('glow-card rounded-lg p-4 cursor-pointer transition border', active?.id === theory.id ? 'border-neon/60' : 'border-transparent hover:border-accent/60')}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-sand/60">{formatDate(theory.postedAt)}</p>
                  <span className={clsx('px-2 py-1 text-xs rounded border tag', statusColors[theory.status])}>{theory.status}</span>
                </div>
                <h3 className="text-lg font-semibold text-neon mt-2">{theory.title}</h3>
                <p className="text-sand/80 line-clamp-3 text-sm">{theory.content}</p>
                <div className="flex items-center justify-between mt-3 text-sm text-sand/70">
                  <span>By {theory.displayAuthor}</span>
                  <span className="text-neon font-semibold">{theory.commentCount} comments</span>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {theory.evidenceUrls.slice(0, 3).map((url) => (
                    <span key={url} className="text-xs tag rounded px-2 py-1 truncate max-w-[200px]">{url}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm text-sand/70">
            <button className="px-3 py-2 rounded border border-accent/40" onClick={() => setFilters({ ...filters, page: Math.max(filters.page - 1, 0) })} disabled={filters.page === 0}>Prev</button>
            <button className="px-3 py-2 rounded border border-accent/40" onClick={() => setFilters({ ...filters, page: (filters.page + 1) })} disabled={!!data && filters.page + 1 >= (data.theories.totalPages || 1)}>Next</button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="glow-card rounded-lg p-4">
            <h2 className="text-lg font-semibold text-neon mb-2">Drop a Theory</h2>
            {!session && <p className="text-sm text-sand/70 mb-2">Login with the secret code to post anonymously.</p>}
            <form className="space-y-3" onSubmit={handleNewTheory}>
              <input className="w-full bg-mist/60 border border-accent/40 rounded px-3 py-2" placeholder="Title" value={newTheory.title} onChange={(e) => setNewTheory({ ...newTheory, title: e.target.value })} required />
              <textarea className="w-full bg-mist/60 border border-accent/40 rounded px-3 py-2 min-h-[100px]" placeholder="Spill the details" value={newTheory.content} onChange={(e) => setNewTheory({ ...newTheory, content: e.target.value })} required />
              <textarea className="w-full bg-mist/60 border border-accent/40 rounded px-3 py-2 min-h-[80px] text-sm" placeholder="Evidence URLs (comma or newline separated)" value={newTheory.evidenceUrls} onChange={(e) => setNewTheory({ ...newTheory, evidenceUrls: e.target.value })} />
              <div className="flex items-center justify-between">
                <label className="text-sm text-sand/70">
                  <input type="checkbox" className="accent-neon mr-2" checked={newTheory.anonymous} onChange={(e) => setNewTheory({ ...newTheory, anonymous: e.target.checked })} />
                  Post as shadow
                </label>
                <select value={newTheory.status} onChange={(e) => setNewTheory({ ...newTheory, status: e.target.value as Status })} className="bg-mist/60 border border-accent/40 rounded px-2 py-1 text-sm">
                  <option value="UNVERIFIED">Unverified</option>
                  <option value="DEBUNKED">Debunked</option>
                  <option value="CONFIRMED">Confirmed</option>
                </select>
              </div>
              <button type="submit" disabled={!session || addingTheory} className="w-full bg-neon text-midnight rounded font-semibold py-2 disabled:opacity-60">{session ? (addingTheory ? 'Deploying...' : 'Broadcast theory') : 'Login to post'}</button>
              {addTheoryError && <p className="text-red-300 text-sm">{addTheoryError.message}</p>}
            </form>
          </div>

          {active && (
            <div className="glow-card rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-neon">{active.title}</h2>
                <span className={clsx('px-2 py-1 text-xs rounded border', statusColors[active.status])}>{active.status}</span>
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-sand/60">{formatDate(active.postedAt)}</p>
              <p className="text-sand/80 leading-relaxed">{active.content}</p>
              <div className="flex gap-2 flex-wrap">
                {active.evidenceUrls.map((url) => (
                  <a key={url} href={url} target="_blank" className="tag rounded px-2 py-1 text-xs hover:text-sand" rel="noreferrer">Evidence</a>
                ))}
              </div>
              <h3 className="text-md font-semibold text-sand mt-2">Comments</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {active.comments.map((comment) => (
                  <div key={comment.id} className="bg-mist/40 border border-accent/30 rounded px-3 py-2">
                    <div className="flex items-center justify-between text-xs text-sand/60">
                      <span>{comment.displayAuthor}</span>
                      <span>{formatDate(comment.postedAt)}</span>
                    </div>
                    <p className="text-sand/90 text-sm">{comment.content}</p>
                  </div>
                ))}
                {active.comments.length === 0 && <p className="text-sand/60 text-sm">No chatter yet.</p>}
              </div>
              <form onSubmit={(event) => submitComment(event, active.id)} className="space-y-2 pt-2 border-t border-accent/40">
                <textarea name="content" placeholder={session ? 'Drop your intel' : 'Login to comment'} disabled={!session} className="w-full bg-mist/60 border border-accent/40 rounded px-3 py-2 min-h-[80px]" />
                <label className="text-sm text-sand/70">
                  <input type="checkbox" name="anonymous" className="accent-neon mr-2" /> Stay anonymous
                </label>
                <button type="submit" disabled={!session} className="w-full bg-accent text-sand rounded py-2 font-semibold disabled:opacity-60">Transmit comment</button>
              </form>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
