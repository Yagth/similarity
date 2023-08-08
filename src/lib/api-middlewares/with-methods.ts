import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import React from 'react'

export default function WithMethods(methods: string[], handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.method || !methods.includes(req.method)){
        return res.status(405).end()
    }
    return handler(req, res )
  }
}
