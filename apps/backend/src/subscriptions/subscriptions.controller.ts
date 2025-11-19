import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// Tipo para el usuario autenticado
interface AuthUser {
  sub: string;
  email: string;
  role: string;
  business?: {
    id: string;
  };
}

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({
    summary: 'Obtener todos los planes de suscripción disponibles',
  })
  @ApiResponse({ status: 200, description: 'Lista de planes' })
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('plans/:id')
  @ApiOperation({ summary: 'Obtener un plan específico por ID' })
  @ApiResponse({ status: 200, description: 'Plan encontrado' })
  @ApiResponse({ status: 404, description: 'Plan no encontrado' })
  async getPlanById(@Param('id') id: string) {
    return this.subscriptionsService.getPlanById(id);
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener la suscripción actual del negocio' })
  @ApiResponse({ status: 200, description: 'Suscripción encontrada' })
  @ApiResponse({ status: 404, description: 'Suscripción no encontrada' })
  async getCurrentSubscription(@CurrentUser() user: AuthUser) {
    // El businessId se obtiene del usuario autenticado
    const businessId = user.business?.id;

    if (!businessId) {
      return { message: 'Este usuario no tiene un negocio asociado' };
    }

    return this.subscriptionsService.getCurrentSubscription(businessId);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar si la suscripción está activa' })
  @ApiResponse({ status: 200, description: 'Estado de la suscripción' })
  async getSubscriptionStatus(@CurrentUser() user: AuthUser) {
    const businessId = user.business?.id;

    if (!businessId) {
      return {
        isActive: false,
        message: 'Este usuario no tiene un negocio asociado',
      };
    }

    const isActive =
      await this.subscriptionsService.isSubscriptionActive(businessId);
    const daysRemaining =
      await this.subscriptionsService.getTrialDaysRemaining(businessId);

    return {
      isActive,
      daysRemaining,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear una nueva suscripción (con trial de 7 días)',
  })
  @ApiResponse({ status: 201, description: 'Suscripción creada' })
  @ApiResponse({ status: 409, description: 'Ya existe una suscripción' })
  async createSubscription(@CurrentUser() user: AuthUser) {
    const businessId = user.business?.id;

    if (!businessId) {
      return { message: 'Este usuario no tiene un negocio asociado' };
    }

    return this.subscriptionsService.createSubscription(businessId);
  }

  @Put('change-plan/:newPlanId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar el plan de suscripción' })
  @ApiResponse({ status: 200, description: 'Plan cambiado exitosamente' })
  @ApiResponse({ status: 400, description: 'No se puede cambiar el plan' })
  async changePlan(
    @CurrentUser() user: AuthUser,
    @Param('newPlanId') newPlanId: string,
  ) {
    const businessId = user.business?.id;

    if (!businessId) {
      return { message: 'Este usuario no tiene un negocio asociado' };
    }

    return this.subscriptionsService.changePlan(businessId, newPlanId);
  }

  @Delete('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancelar suscripción (se cancela al final del período)',
  })
  @ApiResponse({ status: 200, description: 'Suscripción cancelada' })
  @ApiResponse({ status: 400, description: 'No se puede cancelar' })
  async cancelSubscription(@CurrentUser() user: AuthUser) {
    const businessId = user.business?.id;

    if (!businessId) {
      return { message: 'Este usuario no tiene un negocio asociado' };
    }

    return this.subscriptionsService.cancelSubscription(businessId);
  }

  @Post('reactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reactivar una suscripción cancelada' })
  @ApiResponse({ status: 200, description: 'Suscripción reactivada' })
  @ApiResponse({ status: 400, description: 'No se puede reactivar' })
  async reactivateSubscription(@CurrentUser() user: AuthUser) {
    const businessId = user.business?.id;

    if (!businessId) {
      return { message: 'Este usuario no tiene un negocio asociado' };
    }

    return this.subscriptionsService.reactivateSubscription(businessId);
  }

  @Post('payment-preference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Crear preferencia de pago para activar suscripción Pro después del trial',
  })
  @ApiResponse({
    status: 200,
    description: 'Preferencia de pago creada',
  })
  @ApiResponse({ status: 400, description: 'No se puede crear el pago' })
  async createPaymentPreference(@CurrentUser() user: AuthUser) {
    const businessId = user.business?.id;

    if (!businessId) {
      return { message: 'Este usuario no tiene un negocio asociado' };
    }

    return this.subscriptionsService.createSubscriptionPaymentPreference(
      businessId,
    );
  }

  @Post('activate-after-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Activar suscripción Pro después de pago exitoso',
  })
  @ApiResponse({ status: 200, description: 'Suscripción activada' })
  @ApiResponse({ status: 400, description: 'No se puede activar' })
  async activateAfterPayment(
    @CurrentUser() user: AuthUser,
    @Body() body: { paymentId?: string },
  ) {
    const businessId = user.business?.id;

    if (!businessId) {
      return { message: 'Este usuario no tiene un negocio asociado' };
    }

    return this.subscriptionsService.activateSubscriptionAfterPayment(
      businessId,
      body.paymentId,
    );
  }
}
