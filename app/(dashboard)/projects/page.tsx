'use client';

import { useEffect, useState } from 'react';

import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { formatKsh } from '@/lib/format';

import {
  FirestoreProject,
  getProjects,
} from '@/lib/firestore/projects';

import {
  FirestoreUser,
  getUsers,
} from '@/lib/firestore/users';

type ProjectRow = FirestoreProject & {
  clientName: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        setError('');

        const [projectData, userData] = await Promise.all([
          getProjects(),
          getUsers(),
        ]);

        const userMap = new Map<string, FirestoreUser>(
          userData.map((user) => [user.id, user])
        );

        const rows: ProjectRow[] = projectData.map((project) => {
          const client = userMap.get(project.clientId);

          return {
            ...project,
            clientName: client?.fullName ?? 'Unknown client',
          };
        });

        setProjects(rows);
      } catch (err) {
        console.error('Failed to load projects:', err);

        setError(
          'Unable to load projects. Please check your Firebase permissions and project data.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Projects
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Loading projects...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Projects
        </h1>

        <p className="text-sm text-red-600 mt-4">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">
        Projects
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Every project brief posted on the platform.
      </p>

      <div className="mt-6">
        <DataTable
          columns={[
            {
              header: 'Title',
              render: (project) => (
                <span className="font-medium">
                  {project.title}
                </span>
              ),
            },
            {
              header: 'Client',
              render: (project) => project.clientName,
            },
            {
              header: 'Category',
              render: (project) => project.category,
            },
            {
              header: 'Location',
              render: (project) => project.location,
            },
            {
              header: 'Budget',
              render: (project) =>
                `${formatKsh(project.budgetMinKsh)} - ${formatKsh(
                  project.budgetMaxKsh
                )}`,
            },
            {
              header: 'Status',
              render: (project) => (
                <Badge label={project.status} />
              ),
            },
          ]}
          rows={projects}
        />
      </div>
    </div>
  );
}
