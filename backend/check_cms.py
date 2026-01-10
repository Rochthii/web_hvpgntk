import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.cms.models import Page, News

print(f"--- Checking Pages ({Page.objects.count()}) ---")
for p in Page.objects.all():
    print(f"Slug: {p.slug} | Title: {p.title_vi} | Status: {p.status}")

print(f"\n--- Checking News ({News.objects.count()}) ---")
for n in News.objects.all():
    print(f"Slug: {n.slug} | Status: {n.status}")
