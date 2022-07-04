"use strict";

/**
 *  order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const stripe = require("stripe")(
  "sk_test_51LHmYWLfpB65t0MJUSRn7bvtPMl08utNCCcKBneRPGy6A3AJEQxUjiA0NXJ2p6RSAKxmpLn6V3N2BxpKiJFHim7Z00lF7WHzkv"
);

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { address, amount, dishes, token } = JSON.parse(ctx.request.body);
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "jpy",
      source: token,
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
    });

    const order = await strapi.service("api::order.order").create({
      data: {
        publishedAt: new Date(),
        user: ctx.state.user._id,
        charge_id: charge.id,
        amount,
        address,
        dishes,
      },
    });

    // const order = await super.create(ctx);
    return order;
  },
}));
