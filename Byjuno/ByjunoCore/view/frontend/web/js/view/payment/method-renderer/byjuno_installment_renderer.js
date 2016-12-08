/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*browser:true*/
/*global define*/
define(
    [
        'Magento_Checkout/js/view/payment/default',
        'mage/url',
        'Magento_Checkout/js/model/quote'
    ],
    function (Component, url, quote) {
        'use strict';
        return Component.extend({
            redirectAfterPlaceOrder: false,
            defaults: {
                template: 'Byjuno_ByjunoCore/payment/form_installment',
                paymentPlan: window.checkoutConfig.payment.byjuno_installment.default_payment,
                deliveryPlan: window.checkoutConfig.payment.byjuno_installment.default_delivery
            },

            initObservable: function () {
                this._super()
                    .observe([
                        'paymentPlan',
                        'deliveryPlan'
                    ]);
                return this;
            },

            afterPlaceOrder: function () {
                this.selectPaymentMethod();
                window.location.replace(url.build(window.checkoutConfig.payment.byjuno_invoice.redirectUrl));
            },


            getCode: function () {
                return 'byjuno_installment';
            },

            getEmail: function () {
                return window.checkoutConfig.quoteData.customer_email;
            },

            getBillingAddress: function () {
                if (quote.billingAddress() == null) {
                    return null;
                }
                return quote.billingAddress().street[0] + ", " + quote.billingAddress().city + ", " + quote.billingAddress().postcode;
            },

            getData: function () {
                return {
                    'method': this.item.method,
                    'additional_data': {
                        'installment_payment_plan': this.paymentPlan(),
                        'installment_send': this.deliveryPlan()
                    }
                };
            },
            getLogo: function () {
                return window.checkoutConfig.payment.byjuno_installment.logo;
            },

            getPaymentPlans: function () {
                return _.map(window.checkoutConfig.payment.byjuno_installment.methods, function (value, key) {
                    return {
                        'value': value.value,
                        'link': value.link,
                        'label': value.name
                    }
                });
            },

            getDeliveryPlans: function () {
                var list = [];
                for (var i = 0; i < window.checkoutConfig.payment.byjuno_installment.delivery.length; i++) {
                    var value = window.checkoutConfig.payment.byjuno_installment.delivery[i];
                    if (value.value == 'email') {
                        list.push(
                            {
                                'value': value.value,
                                'label': value.text + this.getEmail()
                            }
                        );
                    } else {
                        if (this.getBillingAddress() != null) {
                            list.push(
                                {
                                    'value': value.value,
                                    'label': value.text + this.getBillingAddress()
                                }
                            );
                        }
                    }
                }
                return list;
            }
        });
    }
);