-- View for querying instant split expenses with aggregated payment methods and images
-- This replaces the complex JS-side joins with a single query

CREATE OR REPLACE VIEW public.instant_split_detailed_view AS
SELECT
  e.id,
  e.amount,
  e.category_id,
  e.converted_amount,
  e.converted_currency,
  e.created_at,
  e.currency,
  e.date,
  e.description,
  e.is_deleted,
  e.link,
  e.notes,
  e.settle_metadata,
  e.settle_mode,
  e.status,
  e.updated_at,
  e.user_id,

  -- Profile info as JSON object
  p.name,

  -- Payment methods as JSON array (many-to-1)
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'image_url', pm.image_url,
          'image_key', pm.image_key,
          'image_expired_at', pm.image_expired_at,
          'is_primary', pm.is_primary,
          'type', pm.type,
          'label', pm.label,
          'details', pm.details
        )
        ORDER BY pm.is_primary DESC
      )
      FROM public.payment_methods pm
      WHERE pm.user_id = e.user_id
        AND pm.is_active = true
        AND pm.is_deleted = false
    ),
    '[]'::jsonb
  ) AS payment_methods,

  -- Transaction images as JSON array (many-to-1)
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', uti.id,
          'image_key', uti.image_key,
          'is_active', uti.is_active
        )
      )
      FROM public.user_transaction_images uti
      WHERE uti.transaction_id = e.id
        AND uti.is_active = true
        AND uti.is_deleted = false
    ),
    '[]'::jsonb
  ) AS transaction_images

FROM public.one_time_split_expenses e
LEFT JOIN public.profiles p ON p.id = e.user_id
WHERE e.is_deleted = false;

-- Add comment to the view
COMMENT ON VIEW public.instant_split_detailed_view IS
  'Aggregated view for instant split expenses with payment methods and transaction images as JSON arrays';

-- Grant appropriate permissions (adjust based on your RLS policies)
-- GRANT SELECT ON public.instant_split_detailed_view TO authenticated;
-- GRANT SELECT ON public.instant_split_detailed_view TO anon;
