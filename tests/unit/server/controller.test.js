import { jest, expect, describe, test, beforeEach } from '@jest/globals'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'
import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'

const { pages } = config

describe('#Controller - test controller API methods', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test('async getFileStream - should return a fileStream', async () => {
        const expectedType = ".html"
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        jest.spyOn(
            Service.prototype,
            Service.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType,
        })

        const controller = new Controller()
        const controllerReturn = await controller.getFileStream(pages.homeHTML)

        expect(Service.prototype.getFileStream).toBeCalledWith(pages.homeHTML)
        expect(controllerReturn).toStrictEqual({
            stream: mockFileStream,
            type: expectedType
        })
    });
})