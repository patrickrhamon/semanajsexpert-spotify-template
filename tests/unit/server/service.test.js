import { jest, expect, describe, test, beforeEach } from '@jest/globals'

import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import config from '../../../server/config.js'
import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'

const { dir: { publicDirectory }, } = config

describe('#Services - test service API rules', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test('createFileStram - should create a read stream and return it', async () => {
        const filename = '/index.html'
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        jest.spyOn(fs, fs.createReadStream.name).mockResolvedValue(mockFileStream)

        const service = new Service();
        const serviceReturn = service.createFileStream(filename)

        expect(fs.createReadStream).toHaveBeenCalledWith(filename)
        expect(serviceReturn).resolves.toStrictEqual(mockFileStream)
    })

    test('getFileInfo - should return the file name and type', async () => {
        const filename = '\\index.html'
        const expectedType = '.html'
        const expectedFullFilepath = publicDirectory + filename

        jest.spyOn(path, path.join.name).mockReturnValue(filename)
        jest.spyOn(fsPromises, fsPromises.access.name).mockReturnValue()
        jest.spyOn(path, path.extname.name).mockReturnValue(expectedType)
        
        const service = new Service();
        const serviceReturn = await service.getFileInfo(filename)

        expect(fsPromises.access). toHaveBeenCalledWith(expectedFullFilepath)
        expect(serviceReturn).toStrictEqual({
            name: expectedFullFilepath,
            type: expectedType,
        })
    })

    test('getFileStream - should return a file stream and type', async () => {
        const filename = '/index.html'
        const expectedType = '.html'
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        jest.spyOn(Service.prototype, Service.prototype.getFileInfo.name).mockReturnValue({
            stream: mockFileStream,
            type: expectedType,
        })

        jest.spyOn(Service.prototype, Service.prototype.createFileStream.name).mockReturnValue(mockFileStream)

        const service = new Service()
        const serviceReturn = await service.getFileStream(filename)
        
        expect(Service.prototype.getFileInfo).toHaveBeenCalledWith(filename)
        expect(serviceReturn).toStrictEqual({
            stream: mockFileStream,
            type: expectedType,
        })
    })
})