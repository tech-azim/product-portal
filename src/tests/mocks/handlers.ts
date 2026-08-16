import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '@/lib/constants/api';

export const handlers = [
  // Mock Get Products
  http.get(`${API_BASE_URL}/products`, () => {
    return HttpResponse.json({
      products: [
        {
          id: 1,
          title: 'Essence Mascara Lash Princess',
          description: 'The Essence Mascara Lash Princess is a popular mascara.',
          category: 'beauty',
          price: 9.99,
          discountPercentage: 7.17,
          rating: 4.94,
          stock: 5,
          brand: 'Essence',
          thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
          images: [],
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });
  }),

  // Mock Search Products
  http.get(`${API_BASE_URL}/products/search`, () => {
    return HttpResponse.json({
      products: [
        {
          id: 1,
          title: 'Essence Mascara Lash Princess',
          description: 'The Essence Mascara Lash Princess is a popular mascara.',
          category: 'beauty',
          price: 9.99,
          stock: 5,
          brand: 'Essence',
          thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
          images: [],
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });
  }),

  // Mock Get Categories
  http.get(`${API_BASE_URL}/products/categories`, () => {
    return HttpResponse.json([
      { slug: 'beauty', name: 'Beauty', url: 'https://dummyjson.com/products/category/beauty' },
      { slug: 'smartphones', name: 'Smartphones', url: 'https://dummyjson.com/products/category/smartphones' },
    ]);
  }),

  // Mock Add Product (POST)
  http.post(`${API_BASE_URL}/products/add`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        id: 101,
        ...body,
      },
      { status: 201 }
    );
  }),

  // Mock Update Product (PUT)
  http.put(`${API_BASE_URL}/products/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: Number(params.id),
      ...body,
    });
  }),

  // Mock Delete Product (DELETE)
  http.delete(`${API_BASE_URL}/products/:id`, ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      isDeleted: true,
      deletedOn: new Date().toISOString(),
    });
  }),
];
