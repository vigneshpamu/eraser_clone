import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import SideNavTopSection, { TEAM } from './SideNavTopSection'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import SideNavBottomSection from './SideNavBottomSection'
import { Archive, Flag, Github } from 'lucide-react'
import { useConvex, useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import { FileListContext } from '@/app/_context/FilesListContext'
const menuList = [
  {
    id: 1,
    name: 'Getting Started',
    icon: Flag,
    path: '',
  },
  {
    id: 2,
    name: 'Github',
    icon: Github,
    path: '',
  },
  {
    id: 3,
    name: 'Archive',
    icon: Archive,
    path: '',
  },
]

const SideNav = () => {
  const convex = useConvex()
  const { user }: any = useKindeBrowserClient()
  const createFile = useMutation(api.files.createFile)
  const [activeTeam, setActiveTeam] = useState<TEAM | any>()
  const [totalFiles, setTotalFiles] = useState<Number>()
  const { fileList_, setFileList_ } = useContext(FileListContext)

  useEffect(() => {
    activeTeam && getFiles()
  }, [activeTeam])

  const onFileCreate = (fileName: string) => {
    console.log(fileName)
    createFile({
      fileName: fileName,
      teamId: activeTeam?._id,
      createdBy: user?.email,
      archive: false,
      document: '',
      whiteboard: '',
    }).then(
      (resp) => {
        if (resp) {
          getFiles()
          toast('File created successfully!')
        }
      },
      (e) => {
        toast('Error while creating file')
      }
    )
  }

  const getFiles = async () => {
    const result = await convex.query(api.files.getFiles, {
      teamId: activeTeam?._id,
    })
    console.log(result)
    setFileList_(result)
    setTotalFiles(result?.length)
  }

  return (
    <div
      className=" h-screen 
    fixed w-72 border-[1px] p-6
    flex flex-col
    "
    >
      <div className="flex-1">
        <SideNavTopSection user={user} setActiveTeamInfo={setActiveTeam} />
      </div>
      <div>
        <SideNavBottomSection
          onFileCreate={onFileCreate}
          totalFiles={totalFiles}
        />
      </div>
    </div>
  )
}

export default SideNav
