"use client"

import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { createDevlog } from "@/app/forms/actions/DevlogCreate"
import { getDevlogs } from "@/app/forms/actions/getDevlogs"
import { updateDevlog } from "@/app/forms/actions/DevlogUpdate"
import { updateProjectNameAction } from "@/app/forms/actions/UpdateProjectName"

interface Devlog {
  id: string
  date: string
  text: string
}

interface Project {
  id: string
  name: string
  desc: string
  hours: number
  hackatime_name: string
  userid: string
}

export default function ProjectDetail() {
  const id = String(useParams().id)
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const [devlogs, setDevlogs] = useState<Devlog[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const editQuillRefs = useRef<Map<string, Quill>>(new Map())
  const [project, setProject] = useState<Project | null>(null)
  const [projectName, setProjectName] = useState<string>("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState<string>("")

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Enter your text here...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      })
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const logs = await getDevlogs(id)
      setDevlogs(logs)

      // Fetch project info
      try {
        const res = await fetch(`/api/projects/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProject(data.project)
          setProjectName(data.project.name)
        }
      } catch (error) {
        console.error("Failed to fetch project:", error)
      }

      setLoading(false)
    }
    fetchData()
  }, [id])

  const handleFormSubmit = async (formData: FormData) => {
    if (!quillRef.current) return

    // Add the rich text content to formData
    formData.set("text", quillRef.current.getSemanticHTML())
    // Add the current date/time
    formData.set("date", new Date().toISOString())

    await createDevlog(formData, id)
  }

  const handleEdit = (devlogId: string) => {
    setEditingId(devlogId)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleSaveEdit = async (devlogId: string) => {
    const quill = editQuillRefs.current.get(devlogId)
    if (!quill) return

    const updatedText = quill.getSemanticHTML()
    await updateDevlog(devlogId, updatedText)

    // Refresh devlogs
    const logs = await getDevlogs(id)
    setDevlogs(logs)
    setEditingId(null)
  }

  const initEditQuill = (element: HTMLDivElement | null, devlogId: string, initialContent: string) => {
    if (!element || editQuillRefs.current.has(devlogId)) return

    const quill = new Quill(element, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
    })

    quill.root.innerHTML = initialContent
    editQuillRefs.current.set(devlogId, quill)
  }

  const handleEditName = () => {
    setTempName(projectName)
    setIsEditingName(true)
  }

  const handleCancelNameEdit = () => {
    setTempName("")
    setIsEditingName(false)
  }

  const handleNameFormSubmit = async (formData: FormData) => {
    const newName = formData.get("projectName") as string
    if (!newName?.trim()) return

    try {
      const result = await updateProjectNameAction(id, newName)
      if (result.success) {
        setProjectName(result.project.name)
        setIsEditingName(false)
        setTempName("")
      }
    } catch (error) {
      console.error("Error updating project name:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        {isEditingName ? (
          <form action={async (formData) => { await handleNameFormSubmit(formData) }} className="flex items-center gap-3">
            <input
              type="text"
              name="projectName"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="text-2xl font-bold px-3 py-1 border border-gray-300 rounded flex-1"
              placeholder="Project name"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelNameEdit}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {projectName || "Project Entry"}
            </h1>
            <button
              onClick={handleEditName}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Edit Name
            </button>
          </div>
        )}
      </div>

      <form action={async (formData) => { await handleFormSubmit(formData) }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Text Content
          </label>
          <div
            ref={editorRef}
            className="bg-white min-h-[300px] border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Previous Entries</h2>

        {loading ? (
          <p className="text-gray-500">Loading entries...</p>
        ) : devlogs.length === 0 ? (
          <p className="text-gray-500">No entries yet. Create your first entry above!</p>
        ) : (
          <div className="space-y-6">
            {devlogs.map((devlog) => (
              <div key={devlog.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm text-gray-500">
                    {new Date(devlog.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {editingId !== devlog.id && (
                    <button
                      onClick={() => handleEdit(devlog.id)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editingId === devlog.id ? (
                  <div>
                    <div
                      ref={(el) => initEditQuill(el, devlog.id, devlog.text)}
                      className="bg-white min-h-[200px] border border-gray-300 rounded mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(devlog.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: devlog.text }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}