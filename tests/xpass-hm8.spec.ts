import { test, expect } from '@playwright/test';

test.describe('Sortable table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://104.168.59.50/laboratory/interactions');
  });

  test('Checkbox "Selected" increases when selecting rows', async ({ page }) => {
    // contains(text(), ...) число всередині лічильника змінюється,
    const counter = page.locator('xpath=//*[contains(text(), "Вибрано")]');

    // усі рядки таблиці (беремо саме tbody/tr, а не будь-які tr на сторінці)
    const rows = page.locator('xpath=//table//tbody/tr');
    const total = await rows.count();

    for (let i = 0; i < total; i++) {
      // .// - відносний пошук ВСЕРЕДИНІ вже знайденого рядка (розділ 2)
      const checkbox = rows.nth(i).locator('xpath=.//input[@type="checkbox" and not(@disabled)]');
      await checkbox.check();

      const text = await counter.innerText();
      const selected = Number(text.match(/\d+/)?.[0]);
      expect(selected).toBe(i + 1);
    }
  });

  test('Sort column "Duration"', async ({ page }) => {
    // contains(., "...") беремо ВЕСЬ текст усередині th, включно з можливою іконкою-стрілкою
    const durationHeader = page.locator('xpath=//button[@data-testid="interactions-sort-duration"]');
    const durationCells = page.locator('xpath=//table//tbody/tr/td[4]');

    const getDurations = async () => {
      const texts = await durationCells.allInnerTexts();
      return texts.map(t => parseFloat(t));
    };

    // стовпець вже відсортований за спаданням
    let durations = await getDurations();
    expect(durations).toEqual([...durations].sort((a, b) => b - a));

    await durationHeader.click();
    durations = await getDurations();
    expect(durations).toEqual([...durations].sort((a, b) => a - b)); // зростання

    await durationHeader.click();
    durations = await getDurations();
    expect(durations).toEqual([...durations].sort((a, b) => b - a)); // знов спадання
  });

test('Sort column "Test" alphabetically', async ({ page }) => {
  const testHeader = page.locator('xpath=//button[@data-testid="interactions-sort-name"]');
  const nameCells = page.locator('xpath=//table//tbody/tr/td[2]');

  await testHeader.click();
  let names = await nameCells.allInnerTexts();
  // перший клік - спадання (Я -> А)
  expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a, 'uk')));

  await testHeader.click();
  names = await nameCells.allInnerTexts();
  // другий клік - зростання (А -> Я)
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'uk')));
});

  test('Row can be found through adjacent checkbox (navigation along axes)', async ({ page }) => {
    //  знаходимо клітинку з конкретним текстом (аналог "знайти label за текстом" з конспекту)
    const testNameCell = page.locator('xpath=//td[contains(., "Авторизація")]');

    // ancestor:: - up від клітинки до рядка (двокрапки саме дві, як у конспекті)
    const row = testNameCell.locator('xpath=ancestor::tr');

    // .// - і всередині вже знайденого рядка шукаємо чекбокс
    const checkbox = row.locator('xpath=.//input[@type="checkbox"]');
    await expect(checkbox).toBeVisible();
  });
});
