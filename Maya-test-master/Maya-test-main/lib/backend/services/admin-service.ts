import type { AdminOverview } from "@/lib/backend/contracts";
import { listAlerts } from "@/lib/backend/services/alerts-service";
import { listFavorites } from "@/lib/backend/services/favorites-service";
import { listLeads } from "@/lib/backend/services/leads-service";
import { listNotifications } from "@/lib/backend/services/notifications-service";
import { listViewingRequests } from "@/lib/backend/services/viewing-service";
import { getProperties } from "@/lib/property-store";

export async function getAdminOverview(): Promise<AdminOverview> {
  const [properties, leads, viewingRequests, alerts, favorites, notifications] = await Promise.all([
    getProperties(),
    listLeads(),
    listViewingRequests(),
    listAlerts(),
    listFavorites(),
    listNotifications()
  ]);

  return {
    totals: {
      properties: properties.length,
      leads: leads.length,
      viewingRequests: viewingRequests.length,
      savedSearches: alerts.length,
      notifications: notifications.length + favorites.length
    },
    byRole: {
      guest: 0,
      user: 0,
      agent: 0,
      admin: 0
    },
    recentLeads: leads.slice(0, 5),
    recentViewings: viewingRequests.slice(0, 5),
    featuredProperties: properties.filter((property) => property.mandateType === "exclusive").slice(0, 5)
  };
}
