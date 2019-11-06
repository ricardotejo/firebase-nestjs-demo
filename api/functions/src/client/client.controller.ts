import { Controller, Post, Get, Param, Body, Query, ParseIntPipe, Header } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientRequest, ClientResponse, ClientStats } from './client.model';
import { ApiImplicitQuery, ApiOkResponse, ApiImplicitParam } from '@nestjs/swagger';

@Controller('clients')
export class ClientController {

    constructor(private readonly clientService: ClientService) { }

    @Post()
    async create(@Body() client: ClientRequest): Promise<ClientResponse> {
        return this.clientService.create(client);
    }

    @Get('kpi') // imporant! keep in order before :id
    @Header('Cache-Control', 'none')
    async kpi(): Promise<ClientStats> {
        return this.clientService.kpi();
    }

    @Get(':id')
    @ApiImplicitParam({ name: 'id', type: 'string', required: true })
    async get(@Param() params: { id: string }): Promise<ClientResponse> {
        return this.clientService.get(params.id);
    }

    @Get()
    @ApiImplicitQuery({ name: 'size', type: 'number', required: true })
    @ApiImplicitQuery({ name: 'last', type: 'string', required: false })
    @ApiOkResponse({ type: ClientResponse, isArray: true })
    @Header('Cache-Control', 'none')
    async list(
        @Query('size', new ParseIntPipe()) size: number,
        @Query('last') last?: string,
    ): Promise<ClientResponse[]> {
        return this.clientService.list(size, last);
    }

}
