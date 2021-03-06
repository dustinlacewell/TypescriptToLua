import { Expect, Test, TestCase } from "alsatian";
import * as util from "../../src/util";

export class LuaLibArrayTests
{
    @TestCase([0, 1, 2, 3], [1, 2, 3, 4])
    @Test("forEach")
    public forEach(inp: number[], expected: number[]): void
    {
        const result = util.transpileAndExecute(
            `let arrTest = ${JSON.stringify(inp)};
            arrTest.forEach((elem, index) => {
                arrTest[index] = arrTest[index] + 1;
            })
            return JSONStringify(arrTest);`
        );

        // Assert
        Expect(result).toBe(JSON.stringify(expected));
    }

    @TestCase([], "x => x")
    @TestCase([0, 1, 2, 3], "x => x")
    @TestCase([0, 1, 2, 3], "x => x*2")
    @TestCase([1, 2, 3, 4], "x => -x")
    @TestCase([0, 1, 2, 3], "x => x+2")
    @TestCase([0, 1, 2, 3], "x => x%2 == 0 ? x + 1 : x - 1")
    @Test("array.map")
    public map<T>(inp: T[], func: string): void
    {
        const result = util.transpileAndExecute(`return JSONStringify([${inp.toString()}].map(${func}))`);

        // Assert
        Expect(result).toBe(JSON.stringify(inp.map(eval(func))));
    }

    @TestCase([], "x => x > 1")
    @TestCase([0, 1, 2, 3], "x => x > 1")
    @TestCase([0, 1, 2, 3], "x => x < 3")
    @TestCase([0, 1, 2, 3], "x => x < 0")
    @TestCase([0, -1, -2, -3], "x => x < 0")
    @TestCase([0, 1, 2, 3], "() => true")
    @TestCase([0, 1, 2, 3], "() => false")
    @Test("array.filter")
    public filter<T>(inp: T[], func: string): void
    {
        const result = util.transpileAndExecute(`return JSONStringify([${inp.toString()}].filter(${func}))`);

        // Assert
        Expect(result).toBe(JSON.stringify(inp.filter(eval(func))));
    }

    @TestCase([], "x => x > 1")
    @TestCase([0, 1, 2, 3], "x => x > 1")
    @TestCase([false, true, false], "x => x")
    @TestCase([true, true, true], "x => x")
    @Test("array.every")
    public every<T>(inp: T[], func: string): void
    {
        const result = util.transpileAndExecute(`return JSONStringify([${inp.toString()}].every(${func}))`);

        // Assert
        Expect(result).toBe(JSON.stringify(inp.every(eval(func))));
    }

    @TestCase([], "x => x > 1")
    @TestCase([0, 1, 2, 3], "x => x > 1")
    @TestCase([false, true, false], "x => x")
    @TestCase([true, true, true], "x => x")
    @Test("array.some")
    public some<T>(inp: T[], func: string): void
    {
        const result = util.transpileAndExecute(`return JSONStringify([${inp.toString()}].some(${func}))`);

        // Assert
        Expect(result).toBe(JSON.stringify(inp.some(eval(func))));
    }

    @TestCase([], 1, 2)
    @TestCase([0, 1, 2, 3], 1, 2)
    @TestCase([0, 1, 2, 3], 1, 1)
    @TestCase([0, 1, 2, 3], 1, -1)
    @TestCase([0, 1, 2, 3], -3, -1)
    @TestCase([0, 1, 2, 3, 4, 5], 1, 3)
    @TestCase([0, 1, 2, 3, 4, 5], 3)
    @Test("array.slice")
    public slice<T>(inp: T[], start: number, end?: number): void
    {
        const result = util.transpileAndExecute(`return JSONStringify([${inp.toString()}].slice(${start}, ${end}))`);

        // Assert
        Expect(result).toBe(JSON.stringify(inp.slice(start, end)));
    }

    @TestCase([], 0, 0, 9, 10, 11)
    @TestCase([0, 1, 2, 3], 1, 0, 9, 10, 11)
    @TestCase([0, 1, 2, 3], 2, 2, 9, 10, 11)
    @TestCase([0, 1, 2, 3], 4, 1, 8, 9)
    @TestCase([0, 1, 2, 3], 4, 0, 8, 9)
    @TestCase([0, 1, 2, 3, 4, 5], 5, 9, 10, 11)
    @TestCase([0, 1, 2, 3, 4, 5], 3, 2, 3, 4, 5)
    @Test("array.splice[Insert]")
    public spliceInsert<T>(inp: T[], start: number, deleteCount: number, ...newElements: any[]): void
    {
        const result = util.transpileAndExecute(
            `let spliceTestTable = [${inp.toString()}];
            spliceTestTable.splice(${start}, ${deleteCount}, ${newElements});
            return JSONStringify(spliceTestTable);`
        );

        // Assert
        inp.splice(start, deleteCount, ...newElements);
        Expect(result).toBe(JSON.stringify(inp));
    }

    @TestCase([], 1, 1)
    @TestCase([0, 1, 2, 3], 1, 1)
    @TestCase([0, 1, 2, 3], 10, 1)
    @TestCase([0, 1, 2, 3], 4)
    @TestCase([0, 1, 2, 3, 4, 5], 3)
    @TestCase([0, 1, 2, 3, 4, 5], 2, 2)
    @TestCase([0, 1, 2, 3, 4, 5, 6, 7, 8], 5, 9, 10, 11)
    @Test("array.splice[Remove]")
    public spliceRemove<T>(inp: T[], start: number, deleteCount?: number, ...newElements: any[]): void
    {
        let result;
        if (deleteCount) {
            result = util.transpileAndExecute(
               `let spliceTestTable = [${inp.toString()}];
               spliceTestTable.splice(${start}, ${deleteCount}, ${newElements});
               return JSONStringify(spliceTestTable);`
            );
        } else {
            result = util.transpileAndExecute(
               `let spliceTestTable = [${inp.toString()}];
               spliceTestTable.splice(${start});
               return JSONStringify(spliceTestTable);`
            );
        }

        // Assert
        if (deleteCount) {
            inp.splice(start, deleteCount, ...newElements);
            Expect(result).toBe(JSON.stringify(inp));
        } else {
            inp.splice(start);
            Expect(result).toBe(JSON.stringify(inp));
        }
    }

    @TestCase([], [])
    @TestCase([1, 2, 3], [])
    @TestCase([1, 2, 3], [4])
    @TestCase([1, 2, 3], [4, 5])
    @TestCase([1, 2, 3], [4, 5])
    @TestCase([1, 2, 3], 4, [5])
    @TestCase([1, 2, 3], 4, [5, 6])
    @TestCase([1, 2, 3], 4, [5, 6], 7)
    @TestCase([1, 2, 3], "test", [5, 6], 7, ["test1", "test2"])
    @TestCase([1, 2, "test"], "test", ["test1", "test2"])
    @Test("array.concat")
    public concat<T>(arr: T[], ...args: T[]): void
    {
        const argStr = args.map(arg => JSON.stringify(arg)).join(",");

        const result = util.transpileAndExecute(
            `let concatTestTable: any[] = ${JSON.stringify(arr)};
            return JSONStringify(concatTestTable.concat(${argStr}));`
        );

        // Assert
        const concatArr = arr.concat(...args);
        Expect(result).toBe(JSON.stringify(concatArr));
    }

    @TestCase([], "")
    @TestCase(["test1"], "test1")
    @TestCase(["test1", "test2"], "test1,test2")
    @TestCase(["test1", "test2"], "test1;test2", ";")
    @TestCase(["test1", "test2"], "test1test2", "")
    @Test("array.join")
    public join<T>(inp: T[], expected: string, seperator?: string): void {
        let seperatorLua;
        if (seperator === "") {
            seperatorLua = "\"\"";
        } else if (seperator) {
            seperatorLua = "\"" + seperator + "\"";
        } else {
            seperatorLua = "";
        }
        // Transpile/Execute
        const result = util.transpileAndExecute(
            `let joinTestTable = ${JSON.stringify(inp)};
            return joinTestTable.join(${seperatorLua});`
        );

        // Assert
        const joinedInp = inp.join(seperator);
        Expect(result).toBe(joinedInp);
    }

    @TestCase([], "test1")
    @TestCase(["test1"], "test1")
    @TestCase(["test1", "test2"], "test2")
    @TestCase(["test1", "test2", "test3"], "test3", 1)
    @TestCase(["test1", "test2", "test3"], "test1", 2)
    @TestCase(["test1", "test2", "test3"], "test1", -2)
    @TestCase(["test1", "test2", "test3"], "test1", 12)
    @Test("array.indexOf")
    public indexOf(inp: string[], element: string, fromIndex?: number): void
    {
        let str = `return ${JSON.stringify(inp)}.indexOf("${element}");`;
        if (fromIndex) {
            str = `return ${JSON.stringify(inp)}.indexOf("${element}", ${fromIndex});`;
        }

        // Transpile/Execute
        const result = util.transpileAndExecute(str);

        // Assert
        // Account for lua indexing (-1)
        Expect(result).toBe(inp.indexOf(element, fromIndex));
    }

    @TestCase([1, 2, 3], 3)
    @TestCase([1, 2, 3, 4, 5], 3)
    @Test("array.destructuring.simple")
    public arrayDestructuringSimple(inp: number[], expected: number): void
    {
        const result = util.transpileAndExecute(
            `let [x, y, z] = ${JSON.stringify(inp)}
            return z;
            `);

        // Assert
        Expect(result).toBe(expected);
    }

    @TestCase([1])
    @TestCase([1, 2, 3])
    @Test("array.push")
    public arrayPush(inp: number[]): void
    {
        const result = util.transpileAndExecute(
            `let testArray = [0];
            testArray.push(${inp.join(", ")});
            return JSONStringify(testArray);
            `
            );

        // Assert
        Expect(result).toBe(JSON.stringify([0].concat(inp)));
    }

    @TestCase("[1, 2, 3]", [3, 2])
    @TestCase("[1, 2, 3, null]", [3, 2])
    @Test("array.pop")
    public arrayPop(array: string, expected): void {
        {
            const result = util.transpileAndExecute(
                `let testArray = ${array};
                let val = testArray.pop();
                return val`);

            // Assert
            Expect(result).toBe(expected[0]);
        }
        {
            const result = util.transpileAndExecute(
                `let testArray = ${array};
                testArray.pop();
                return testArray.length`);

            // Assert
            Expect(result).toBe(expected[1]);
        }
    }

    @TestCase("[1, 2, 3]", [3, 2, 1])
    @TestCase("[1, 2, 3, null]", [3, 2, 1])
    @TestCase("[1, 2, 3, 4]", [4, 3, 2, 1])
    @TestCase("[1]", [1])
    @TestCase("[]", [])
    @Test("array.reverse")
    public arrayReverse(array: string, expected): void
    {
        const result = util.transpileAndExecute(
            `let testArray = ${array};
            let val = testArray.reverse();
            return JSONStringify(testArray)`);
        // Assert
        Expect(result).toBe(JSON.stringify(expected));
    }

    @TestCase("[1, 2, 3]", [2, 3], 1)
    @TestCase("[1]", [], 1)
    @TestCase("[]", [], undefined)
    @Test("array.shift")
    public arrayShift(array: string, expectedArray: number[], expectedValue: number): void {
        {
            // test array mutation
            {
                const result = util.transpileAndExecute(
                    `let testArray = ${array};
                    let val = testArray.shift();
                    return JSONStringify(testArray)`);
                // Assert
                Expect(result).toBe(JSON.stringify(expectedArray));
            }
            // test return value
            {
                const result = util.transpileAndExecute(
                    `let testArray = ${array};
                    let val = testArray.shift();
                    return val`);

                // Assert
                Expect(result).toBe(expectedValue);
            }
        }
    }
    @TestCase("[3, 4, 5]", [1, 2], [1, 2, 3, 4, 5])
    @TestCase("[]", [], [])
    @TestCase("[1]", [], [1])
    @TestCase("[]", [1], [1])
    @Test("array.unshift")
    public arrayUnshift(array: string, toUnshift, expected): void
    {
        const result = util.transpileAndExecute(
            `let testArray = ${array};
            testArray.unshift(${toUnshift});
            return JSONStringify(testArray)`);

        // Assert
        Expect(result).toBe(JSON.stringify(expected));
    }

    @TestCase("[4, 5, 3, 2, 1]", [1, 2, 3, 4, 5])
    @TestCase("[1]", [1])
    @TestCase("[1, null]", [1])
    @TestCase("[]", [])
    @Test("array.sort")
    public arraySort(array: string, expected): void
    {
        const result = util.transpileAndExecute(
            `let testArray = ${array};
            testArray.sort();
            return JSONStringify(testArray)`);

        // Assert
        Expect(result).toBe(JSON.stringify(expected));
    }
    @TestCase("true", "4", "5", 4)
    @TestCase("false", "4", "5", 5)
    @TestCase("3", "4", "5", 4)
    @Test("Ternary Conditional")
    public ternaryConditional(condition: string, lhs: string, rhs: string, expected: any): void
    {
        const result = util.transpileAndExecute(`return ${condition} ? ${lhs} : ${rhs};`);

        // Assert
        Expect(result).toBe(expected);
    }

    @TestCase("true", 11)
    @TestCase("false", 13)
    @TestCase("a < 4", 13)
    @TestCase("a == 8", 11)
    @Test("Ternary Conditional Delayed")
    public ternaryConditionalDelayed(condition: string, expected: any): void
    {
        const result = util.transpileAndExecute(
            `let a = 3;
             let delay = () => ${condition} ? a + 3 : a + 5;
             a = 8;
             return delay();`);

        // Assert
        Expect(result).toBe(expected);
    }
}
