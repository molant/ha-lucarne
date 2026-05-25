import type { HomeAssistant, TaskType, TaskSource } from './types.js';

export interface AddTaskParams {
  member: string;
  summary: string;
  type: TaskType;
  recurrence?: string;
  icon?: string;
  due?: string;
  source?: TaskSource;
  assignee?: string;
}

export async function addTask(hass: HomeAssistant, params: AddTaskParams): Promise<void> {
  const serviceData: Record<string, unknown> = {
    member: params.member,
    summary: params.summary,
    type: params.type,
  };
  if (params.recurrence !== undefined) serviceData.recurrence = params.recurrence;
  if (params.icon !== undefined) serviceData.icon = params.icon;
  if (params.due !== undefined) serviceData.due = params.due;
  if (params.source !== undefined) serviceData.source = params.source;
  if (params.assignee !== undefined) serviceData.assignee = params.assignee;

  await hass.callService('lucarne_family', 'add_task', serviceData);
}

export interface UpdateTaskMetadataFields {
  type?: TaskType;
  recurrence?: string;
  icon?: string;
  assignee?: string;
}

export async function updateTaskMetadata(
  hass: HomeAssistant,
  uid: string,
  fields: UpdateTaskMetadataFields,
): Promise<void> {
  const serviceData: Record<string, unknown> = { uid };
  if (fields.type !== undefined) serviceData.type = fields.type;
  if (fields.recurrence !== undefined) serviceData.recurrence = fields.recurrence;
  if (fields.icon !== undefined) serviceData.icon = fields.icon;
  if (fields.assignee !== undefined) serviceData.assignee = fields.assignee;

  await hass.callService('lucarne_family', 'update_task_metadata', serviceData);
}

export async function deleteTask(hass: HomeAssistant, uid: string): Promise<void> {
  await hass.callService('lucarne_family', 'delete_task', { uid });
}

export async function uploadAvatar(
  hass: HomeAssistant,
  memberSlug: string,
  file: File,
): Promise<void> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  const image_data = btoa(binary);

  await hass.callService('lucarne_family', 'upload_avatar', {
    member: memberSlug,
    image_data,
    mime_type: file.type,
  });
}

export async function setMemberAvatar(
  hass: HomeAssistant,
  memberSlug: string,
  avatar: string,
): Promise<void> {
  await hass.callService('lucarne_family', 'set_member_avatar', {
    member: memberSlug,
    avatar,
  });
}
