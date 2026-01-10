import os
import django
import sys

# Add project root to sys.path
sys.path.append(os.getcwd())

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.cms.models import News, Page

def check_content():
    print("--- News ---")
    news_count = News.objects.count()
    print(f"Total News: {news_count}")
    for news in News.objects.all():
        print(f"- Title: {news.title_vi}, Status: {news.status}, Slug: {news.slug}")

    print("\n--- Pages ---")
    page_count = Page.objects.count()
    print(f"Total Pages: {page_count}")
    for page in Page.objects.all():
        print(f"- Title: {page.title_vi}, Status: {page.status}, Slug: {page.slug}")

if __name__ == '__main__':
    check_content()
